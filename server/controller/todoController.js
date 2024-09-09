import todo from "../schema/todoSchema.js";
import validationSchema from "../validation/validations.js";
import register from "../schema/registerSchema.js";
export const addData = async (req, res) => {
  try {
    const { title, userId } = req.body;
    console.log(`Getting title ${title} and give userId ${userId}`);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!title) {
      res.status(401).json({ error: "Title is required" });
    }

    const user = await register.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTodo = await todo.create({ title, userId });

    if (!newTodo) {
      return res.status(400).json({ error: "Failed to add todo" });
    }

    res.status(201).json({ message: "Todo added successfully", newTodo });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//2. Read

// export const getData = async (req, res) => {
//   try {
//     const { userId, start_date, end_date } = req.query;
//     console.log(userId);

//     if (!userId) {
//       return res.status(401).json({ error: "Id not found" });
//     }

//     const query = { userId };

//     if (start_date && end_date) {
//       query.createdAt = {
//         $gte: start_date,
//         $lte: end_date,
//       };
//     }

//     const dataFromDb = await todo.find(query);
//     console.log("This is what we are getting in date data", dataFromDb);

//     return res
//       .status(200)
//       .json({ message: "Todos fetched successfully", dataFromDb });
//   } catch (error) {
//     return res.status(500).json({ error: "Error retrieving data" });
//   }
// };

//2. Read

// export const getData = async (req, res) => {
//   const { id, search } = req.query;
//   console.log(`I am getting userId ${id} and i am getting search ${search}`);
//   try {
//     let dataFromDb;
//     if (search) {
//       dataFromDb = await todo.aggregate([
//         {
//           $search: {
//             index: "default",
//             text: {
//               query: search, // the search term
//               path: "title", //On which term you want to impliment search\
//             },
//           },
//         },
//         {
//           $match: {
//             userId: id, //
//           },
//         },
//       ]);
//     } else {
//       dataFromDb = await todo.find({ userId: id });
//     }
//     if (!dataFromDb || dataFromDb.length == 0) {
//       return res.status(404).json({ message: "No todos found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Todos fetched successfully", dataFromDb });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error retrieving data", error: error.message });
//   }
// };

export const getData = async (req, res) => {
  try {
    const { userId, search, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Id not found" });
    }
    console.log(
      "This is starting date",
      startDate,
      "This is ending date",
      endDate
    );

    let query = { userId };
    console.log("This is query before search", query);

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    console.log("This is query after search and date filter", query);

    const dataFromDb = await todo.find(query);

    return res.status(200).json({
      message: "Todos fetched successfully",
      data: dataFromDb,
      decodedData: req.user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving data" });
  }
};

//3. Update

export const updateData = async (req, res) => {
  try {
    console.log("Update is working");

    const { id } = req.body;
    const { title } = req.body;
    console.log(id, title);

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const updatedTodo = await todo.findByIdAndUpdate(id, { title });
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo updated successfully", updatedTodo });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//4. Delete

export const deleteData = async (req, res) => {
  try {
    console.log("Working");

    const { id } = req.query;
    const deletedTodo = await todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", deletedTodo });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
