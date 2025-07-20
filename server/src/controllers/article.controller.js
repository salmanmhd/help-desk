import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { validateFields } from "../utils/validateRequiredFields.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Article } from "../models/article.model.js";

const createArticle = asyncHandler(async (req, res) => {
  const { title, description, topic, tags } = req.body;
  const requiredFields = { title, description, topic };
  const missingFields = validateFields(requiredFields);

  if (missingFields.length > 0) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Missing fields: ${missingFields.join(", ")}`,
      })
    );
    return;
  }

  if (!isValidObjectId(topic)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid topic id, pleae enter correct id`,
      })
    );
    return;
  }

  try {
    const article = await Article.create({
      title,
      description,
      topic,
      tags,
    });

    if (!article) {
      res.status(500).json(
        new ErrorResponse(500, {
          code: "",
          message: `Something went wrong while creating a new article`,
        })
      );
      return;
    }

    res
      .status(201)
      .json(new ApiResponse(201, "Article created successfully", article));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `something went wrong while adding articles`,
      })
    );
    return;
  }
});

const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid article id, please enter correct id`,
      })
    );
    return;
  }

  try {
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: `Article not found`,
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Article deleted successfully", {}));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while deleting article`,
      })
    );
    return;
  }
});

const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, topic, tags } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid article id, please enter correct id`,
      })
    );
    return;
  }

  if (topic && !isValidObjectId(topic)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid topic id, please enter correct id`,
      })
    );
    return;
  }

  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { title, description, topic, tags },
      { new: true, runValidators: true }
    );

    if (!article) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: `Article not found`,
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Article updated successfully", article));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while updating article`,
      })
    );
    return;
  }
});

const getRecentArticles = asyncHandler(async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(5);

    res
      .status(200)
      .json(
        new ApiResponse(200, "Recent articles fetched successfully", articles)
      );
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: "Something went wrong while fetching recent articles",
      })
    );
    return;
  }
});

// const getMostAskedArticles = asyncHandler(async (req, res) => {
//   console.log(`🔴 inside getMostAskedArticles`);
//   try {
//     const articles = await Article.find({}).sort({ view_count: -1 }).limit(10);

//     if (!articles) {
//       res.status(404).json(
//         new ErrorResponse(404, {
//           code: "",
//           message: "Articles not found",
//         })
//       );
//       return;
//     }

//     res
//       .status(200)
//       .json(
//         new ApiResponse(200, "Top articles fetched successfully", articles)
//       );
//   } catch (error) {
//     res.status(500).json(
//       new ErrorResponse(500, {
//         code: "",
//         message: `Something went wrong while fetching top articles ${error.message}`,
//       })
//     );
//     return;
//   }
// });

async function getMostAskedArticles(req, res) {
  try {
    const articles = await Article.find({}).sort({ view_count: -1 }).limit(10);

    if (!articles) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: "Articles not found",
        })
      );
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Top articles fetched successfully", articles)
      );
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while fetching top articles ${error.message}`,
      })
    );
    return;
  }
}

const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: "Invalid article ID",
      })
    );
    return;
  }

  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { view_count: 1 } },
      { new: true }
    );

    if (!article) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: "Article not found",
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Article fetched successfully", article));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: "Something went wrong while fetching the article",
      })
    );
    return;
  }
});

const getArticlesByTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  if (!isValidObjectId(topicId)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: "Invalid topic ID",
      })
    );
    return;
  }

  try {
    const articles = await Article.find({ topic: topicId });

    if (!articles) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: "Articles not found",
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Articles fetched successfully", articles));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: "Something went wrong while fetching articles by topic",
      })
    );
    return;
  }
});

export {
  getArticleById,
  getMostAskedArticles,
  getRecentArticles,
  getArticlesByTopic,
  createArticle,
  deleteArticle,
  updateArticle,
};
