export class DataBaseStatus {
    message!: string;
    timestamp!: string;
    status!: string;
    speed!:number
}

export class LivenessResponse {
    timestamp!: string;
    status!: string;
    uptime!: number;
    memoryUsage!: number;
    cpuUsage!: number;
}