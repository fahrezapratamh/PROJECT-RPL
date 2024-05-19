"use client";
import { Button } from "../ui/button";
import { GripVertical, Loader2, Plus } from "lucide-react";
import ListTasks from "../schedule/listTask";
import { useEffect, useState } from "react";
import * as React from "react";
import AlertDeleteTask from "../alert/alertdelete";
import { TasksData } from "@/types";
import DialogAddTasks from "../form/dialogFormAddTasks";
import { useTasks } from "@/hooks/useTaskManager";
import { formatDateString } from "@/utils/date";
import DialogEditTasks from "../form/dialogFormEditTasks";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function CardTasksTeams() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TasksData>({} as TasksData);
  const [activeStatus, setActiveStatus] = useState("");
  const [activePriority, setActivePriority] = useState("");
  const { data: session } = useSession();
  const { toast } = useToast();

  const { isLoading, tasksTeam, fetchTasksTeams, handleDeleteTask } =
    useTasks();

  const handleDeleteTasks = async () => {
    await handleDeleteTask(selectedTask.id);
    setAlertActive(false);
  };
  useEffect(() => {
    fetchTasksTeams();
  }, [fetchTasksTeams]);

  const handleStatusChange = (status: string, type?: "status" | "priority") => {
    if (type === "status") {
      setActiveStatus(status);
      setActivePriority("");
    } else {
      setActivePriority(status);
      setActiveStatus("");
    }
  };

  const filteredTasks = tasksTeam.filter((task) => {
    const statusMatch = task.statusTask === activeStatus || activeStatus === "";
    const priorityMatch =
      task.priority === activePriority || activePriority === "";
    return statusMatch && priorityMatch && task.assigned.length === 0;
  });

  return (
    <>
      <AlertDeleteTask
        isOpen={alertActive}
        setIsOpen={setAlertActive}
        data={selectedTask}
        onClickDelete={() => {
          if (selectedTask.createdBy === session?.user?.id) {
            handleDeleteTask(selectedTask.id);
          } else {
            toast({
              title: "Failed",
              description: "Only the creator can delete task",
              duration: 2000,
              variant: "destructive",
            });
          }
        }}
      />
      <DialogEditTasks
        isOpen={formActive}
        setIsOpen={setFormActive}
        title="Edit Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        showTrigger={false}
        oneEditTask={fetchTasksTeams}
      />
      <div className="flex flex-col border px-5 py-2 rounded-lg lg:w-1/2 w-full h-full">
        <div className="flex items-center justify-between pr-0.5">
          <div className="flex flex-col">
            <span className="lg:text-base text-sm font-bold">
              Task Priorities
            </span>
            <span className="text-sm text-muted-foreground">
              Teams Task Sorted by {" "}
              {activePriority === ""
                ? activeStatus
                : activePriority
                ? "Priority"
                : "Status"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <DialogAddTasks
              isOpen={modalOpen}
              setIsOpen={setModalOpen}
              title="Add Task Team"
              showTrigger={true}
              onTaskAdded={fetchTasksTeams}
              action="team"
            />
            {/* <Button className="px-2" variant={"ghost"}>
              <GripVertical className="text-muted-foreground" />
              <span className="sr-only">Sort</span>
            </Button> */}
          </div>
        </div>
        <ScrollArea>
          <div className="flex items-center lg:gap-2 gap-1 lg:flex-nowrap flex-wrap h-full w-max py-3">
            <Button
              className={`mt-3 ${activeStatus === "" ? "bg-secondary" : ""}`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("")}
            >
              All
            </Button>
            <Button
              className={`mt-3 ${
                activeStatus === "on going" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("on going")}
            >
              On Going
            </Button>
            <Button
              className={`mt-3 ${
                activeStatus === "completed" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("completed")}
            >
              completed
            </Button>
            <Button
              className={`mt-3 ${
                activeStatus === "pending" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("pending")}
            >
              pending
            </Button>
            <Button
              className={`mt-3 ${
                activeStatus === "cancel" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("cancel")}
            >
              cancel
            </Button>
            <Button
              className={`mt-3 ${
                activePriority === "High" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("High", "priority")}
            >
              Priority High
            </Button>
            <Button
              className={`mt-3 ${
                activePriority === "Medium" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("Medium", "priority")}
            >
              Priority Medium
            </Button>
            <Button
              className={`mt-3 ${
                activePriority === "Low" ? "bg-secondary" : ""
              }`}
              variant={"outline"}
              size="sm"
              onClick={() => handleStatusChange("Low", "priority")}
            >
              Priority Low
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="max-h-[320px] overflow-auto overflow-TaskList pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[12vh] gap-1">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task: TasksData) => {
              const formattedDeadline = formatDateString(
                task.dueTime,
                "dd MMMM yyyy HH:mm:ss"
              );
              const formattedCreatedAt = formatDateString(
                task.dueDate,
                "dd MMMM yyyy HH:mm:ss"
              );
              const isOverdue = new Date() > new Date(task.dueTime);
              return (
                <ListTasks
                  key={task.id}
                  link={task.id}
                  title={task.title}
                  description={task.description}
                  deadline={formattedDeadline}
                  created_At={formattedCreatedAt}
                  isOverdue={isOverdue}
                  statusTask={task.statusTask}
                  showAlertDelete={() => {
                    setAlertActive(!alertActive);
                    setSelectedTask({
                      ...task,
                    });
                  }}
                  showDialogEdit={() => {
                    if (session?.user?.id !== task.createdBy) {
                      toast({
                        title: "Unauthorized",
                        description:
                          "You don't have permission to edit this task",
                        variant: "destructive",
                      });
                    } else {
                      setFormActive(!formActive);
                      setSelectedTask({
                        ...task,
                      });
                    }
                  }}
                />
              );
            })
          ) : (
            <div className="flex justify-center flex-col gap-5 items-center h-full py-5">
              <svg
                width="184"
                height="152"
                viewBox="0 0 184 152"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(24 31.67)">
                    <ellipse
                      fillOpacity=".8"
                      fill="#F5F5F7"
                      cx="67.797"
                      cy="106.89"
                      rx="67.797"
                      ry="12.668"
                    />
                    <path
                      d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                      fill="#AEB8C2"
                    />
                    <path
                      d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z"
                      fill="url(#linearGradient-1)"
                      transform="translate(13.56)"
                    />
                    <path
                      d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                      fill="#F5F5F7"
                    />
                    <path
                      d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                      fill="#DCE0E6"
                    />
                  </g>
                  <path
                    d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    fill="#DCE0E6"
                  />
                  <g transform="translate(149.65 15.383)" fill="#FFF">
                    <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                    <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                  </g>
                </g>
              </svg>
              <span className="text-sm text-center ">No Task Teams Found</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
