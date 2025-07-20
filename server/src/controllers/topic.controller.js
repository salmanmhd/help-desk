import { isValidObjectId } from "mongoose";
import { Topic } from "../models/topics.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateFields } from "../utils/validateRequiredFields.js";

const createTopic = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(`🔴 inside add topic`);

  const requiredField = req.body;

  const missingFields = validateFields(requiredField);

  if (missingFields.length > 0) {
    ErrorResponse(400, {
      code: "",
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
    return;
  }

  try {
    const topic = await Topic.create({
      title,
      description,
    });

    if (!topic) {
      res.status(400).json(
        new ErrorResponse(500, {
          code: "",
          message: `Something went wrong while creating new Topic`,
        })
      );
      return;
    }

    res
      .status(201)
      .json(new ApiResponse(201, "Topic created successfully", topic));
  } catch (error) {
    ErrorResponse(500, {
      code: "",
      message: `Something went wrong while adding topic, ${error.message}`,
    });
  }
});

const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid or missing topic id, please enter correct id`,
      })
    );
    return;
  }

  try {
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: `Topic not found`,
        })
      );
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Topic deleted successfully", topic));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while deleting a topic, ${error.message}`,
      })
    );
    return;
  }
});
const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const requiredFields = { id, title, description };
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

  if (!isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: `Invalid topic id, please enter correct id`,
      })
    );
    return;
  }

  try {
    const topic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!topic) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: `Topic not found`,
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Topic updated successfully", topic));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while updating the topic, ${error.message}`,
      })
    );
    return;
  }
});
const getTopics = asyncHandler(async (req, res) => {
  try {
    const topics = await Topic.find();
    res
      .status(200)
      .json(new ApiResponse(200, "Topics fetched successfully", topics));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while fetching topics, ${error.message}`,
      })
    );
  }
});
const getTopicById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    res.status(400).json(
      new ErrorResponse(400, {
        code: "",
        message: "Invalid topic ID",
      })
    );
    return;
  }

  try {
    const topic = await Topic.findById(id);

    if (!topic) {
      res.status(404).json(
        new ErrorResponse(404, {
          code: "",
          message: "Topic not found",
        })
      );
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Topic fetched successfully", topic));
  } catch (error) {
    res.status(500).json(
      new ErrorResponse(500, {
        code: "",
        message: `Something went wrong while fetching topics, ${error.message}`,
      })
    );
    return;
  }
});

export { createTopic, deleteTopic, updateTopic, getTopicById, getTopics };
