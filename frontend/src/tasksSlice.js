import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await axios.get("http://localhost:3000/get");
  return res.data;
});

export const addTask = createAsyncThunk("tasks/add", async (title) => {
  const res = await axios.post("http://localhost:3000/add", { title, status: "todo" });
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await axios.delete(`http://localhost:3000/delete/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [] },
  reducers: {
    moveTask: (state, action) => {
      const task = state.tasks.find(t => t._id === action.payload.id);
      if (task) {
        const prevStatus = task.status;
        task.status = action.payload.newStatus;

        // Optimistic Update → Server Sync
        axios.put(`http://localhost:3000/update/${task._id}`, {
          status: action.payload.newStatus
        }).catch(() => {
          task.status = prevStatus; // Rollback
          alert("❌ Failed to update task");
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  }
});

export const { moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;
