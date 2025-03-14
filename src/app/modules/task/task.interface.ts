import { ObjectId } from "mongoose"

export type TTask = {
    assignTo: ObjectId;
    taskTitle: string;
    taskDescription: string;
    taskStatus: "pending" | "completed";
    deadline: Date;
    solutionDetails: string;
}