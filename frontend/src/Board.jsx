import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, moveTask, addTask, deleteTask } from "./tasksSlice";

export default function Board() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    dispatch(moveTask({
      id: result.draggableId,
      newStatus: result.destination.droppableId
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask(newTask));
      setNewTask(""); // clear input
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const columns = ["todo", "inprogress", "done"];

  return (
    <div className="p-4">
      <h1 className="text-center mb-8 text-5xl font-bold uppercase">Kanban Board Project</h1>
      {/* ✅ Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* ✅ Drag and Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="flex-1 p-4 bg-gray-100 rounded-lg min-h-[400px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="font-bold text-lg mb-2 text-center mb-5 border-2">{status.toUpperCase()}</h2>
                  {tasks.filter((t) => t.status === status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className="p-2 m-2 bg-white rounded shadow flex justify-between items-center"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{task.title}</span>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
