"use client";

import { useCallback, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

type ColumnId = "backlog" | "inProgress" | "review" | "done";

type Column = {
  id: ColumnId;
  title: string;
  subtitle: string;
  tasks: Task[];
};

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    subtitle: "Planned work",
    tasks: [
      {
        id: "task-1",
        title: "Define sprint goals",
        description: "Clarify objectives and acceptance criteria for next sprint.",
        assignee: "Ava Patel",
        dueDate: "Apr 4",
        priority: "High",
      },
      {
        id: "task-2",
        title: "Gather stakeholder feedback",
        description: "Collect feedback from product and ops teams.",
        assignee: "Liam Chen",
        dueDate: "Apr 6",
        priority: "Medium",
      },
    ],
  },
  {
    id: "inProgress",
    title: "In Progress",
    subtitle: "Work actively being executed",
    tasks: [
      {
        id: "task-3",
        title: "Design task board",
        description: "Build wireframes for the kanban board experience.",
        assignee: "Nina Ross",
        dueDate: "Apr 2",
        priority: "High",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    subtitle: "Ready for validation",
    tasks: [
      {
        id: "task-4",
        title: "QA checklist",
        description: "Validate task workflow and edge cases.",
        assignee: "Mia Johnson",
        dueDate: "Apr 1",
        priority: "Low",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    subtitle: "Completed work",
    tasks: [
      {
        id: "task-5",
        title: "Project kickoff",
        description: "Kickoff meeting with the project team.",
        assignee: "Ethan Grant",
        dueDate: "Mar 28",
        priority: "Medium",
      },
    ],
  },
];

const priorityStyles: Record<Task["priority"], string> = {
  Low: "bg-emerald-500/15 text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-300",
  High: "bg-rose-500/15 text-rose-300",
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromColumnId: ColumnId;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    columnId: ColumnId;
    taskIndex: number;
  } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback(
    (taskId: string, fromColumnId: ColumnId) => {
      setDraggedTask({ taskId, fromColumnId });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const handleDragEnterTask = useCallback(
    (columnId: ColumnId, taskIndex: number) => {
      setDropTarget({ columnId, taskIndex });
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, destinationColumnId: ColumnId) => {
      event.preventDefault();

      if (!draggedTask) {
        return;
      }

      const sourceColumn = columns.find(
        (column) => column.id === draggedTask.fromColumnId
      );
      const destinationColumn = columns.find(
        (column) => column.id === destinationColumnId
      );

      if (!sourceColumn || !destinationColumn) {
        return;
      }

      const task = sourceColumn.tasks.find(
        (item) => item.id === draggedTask.taskId
      );

      if (!task) {
        return;
      }

      const sourceIndex = sourceColumn.tasks.findIndex(
        (item) => item.id === task.id
      );

      let destinationIndex =
        dropTarget?.columnId === destinationColumnId
          ? dropTarget.taskIndex
          : destinationColumn.tasks.length;

      if (
        sourceColumn.id === destinationColumn.id &&
        sourceIndex < destinationIndex
      ) {
        destinationIndex -= 1;
      }

      const nextColumns = columns.map((column) => {
        if (column.id === sourceColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter((item) => item.id !== task.id),
          };
        }

        return column;
      });

      const updatedColumns = nextColumns.map((column) => {
        if (column.id !== destinationColumnId) {
          return column;
        }

        const nextTasks = [...column.tasks];
        nextTasks.splice(destinationIndex, 0, task);

        return { ...column, tasks: nextTasks };
      });

      setColumns(updatedColumns);
      setDraggedTask(null);
      setDropTarget(null);
    },
    [columns, draggedTask, dropTarget]
  );

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Project Management
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Kanban Board
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Drag tasks across workflow columns to manage priorities, progress,
              and release readiness.
            </p>
          </div>
          <div className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              Active columns: {columns.length}
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              Total tasks:{" "}
              {columns.reduce((sum, column) => sum + column.tasks.length, 0)}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-950/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {column.title}
                </h2>
                <p className="text-sm text-slate-400">{column.subtitle}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                {column.tasks.length}
              </span>
            </div>

            <div
              className="space-y-4"
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, column.id)}
            >
              {column.tasks.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-700/80 bg-slate-900/70 p-6 text-center text-sm text-slate-500">
                  Drop tasks here
                </div>
              ) : null}

              {column.tasks.map((task, index) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnterTask(column.id, index)}
                  onClick={() => handleTaskClick(task)}
                  className="group cursor-pointer rounded-3xl border border-slate-800/80 bg-slate-900/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Assigned to</span>
                      <span className="text-white">{task.assignee}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Due date</span>
                      <span className="text-white">{task.dueDate}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-400">
                    <span className="font-medium text-slate-200">
                      Drag to move
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-700/70 bg-slate-950 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  Task details
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {selectedTask.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  View the complete task information, assignee, due date, and priority.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white"
                aria-label="Close task details"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-3xl bg-slate-900/80 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Description
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-200">
                    {selectedTask.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Assignee
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    {selectedTask.assignee}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl bg-slate-900/80 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Due Date
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    {selectedTask.dueDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Priority
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-[0.18em] ${priorityStyles[selectedTask.priority]}`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}