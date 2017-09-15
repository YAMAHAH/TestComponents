import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EventEmitter } from '@angular/core';
import { UUID } from './uuid';
export class TaskQueue {
    /**
     * 任务ID
     */
    taskId?: string = UUID.uuid(10, 10).toString();
    /**
     * 任务运行状态
     */
    status?: TaskStatus = TaskStatus.waiting;
    /**
     * 任务运行前执行函数
     */
    runTaskBefore?: () => void;
    /**
     * 任务运行后执行函数
     */
    runTaskAfter?: () => void;
    /**
     * 任务检验函数
     */
    validate?: () => boolean;
    /**
     * 任务运行函数
     */
    run: () => void;
    /**
     * 任务运行结果
     */
    result?: EventEmitter<any> = new EventEmitter<any>();
    /**
     *
     */
    constructor(run: () => void,
        validate?: () => boolean,
        runTaskBefore?: () => void,
        runTaskAfter?: () => void) {
        this.run = run;
        this.validate = validate;
        this.runTaskBefore = runTaskBefore;
        this.runTaskAfter = runTaskAfter;

    }
}

export enum TaskStatus {
    /**
     * 等待
     */
    waiting = 1,
    /**
     * 验证
     */
    invalidate = 2,
    /**
     * 运行中
     */
    running = 3,
    /**
     * 完成
     */
    done = 4
}
export class TaskQueueManager {
    protected taskList: TaskQueue[] = [];
    protected isTaskRunning: boolean;
    protected taskListen$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() {
        this.taskListen$.subscribe(async res => {
            if (res && this.hasTask && !this.isTaskRunning) {
                this.isTaskRunning = true;
                await this.runTask(this.taskList.shift());
            }
        });
    }

    pushTask(task: TaskQueue) {
        task.status = TaskStatus.waiting;
        this.taskList.push(task);
        this.taskListen$.next("running");
    }

    get hasTask() {
        return this.taskList.length > 0;
    }
    existTask(taskId: string) {
        return this.taskList.some(v => v.taskId == taskId);
    }

    private async runTaskWapper(task: TaskQueue) {
        if (task.run) task.run();
    }
    private async runTask(task: TaskQueue) {
        if (task && !!task.validate && !task.validate()) {
            task.status = TaskStatus.invalidate;
            this.isTaskRunning = false;
            if (this.hasTask && !this.isTaskRunning)
                this.runTask(this.taskList.shift());
            else return;
        }
        task.status = TaskStatus.running;

        if (task.runTaskBefore) task.runTaskBefore();
        await this.runTaskWapper(task);
        if (task.runTaskAfter) task.runTaskAfter();

        task.status = TaskStatus.done;
        this.isTaskRunning = false;

        if (this.hasTask && !this.isTaskRunning)
            await this.runTask(this.taskList.shift());
    }
}