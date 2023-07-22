import { tasksActions, TasksInitialStateType, tasksReducer } from 'features/todoLists/tasks/taskSlice';
import { TaskPriorities, TaskStatuses, TodoListServerType } from 'api/api';
import { todoListsActions } from 'features/todoLists/todoListSlice';

describe('Tasks reducer tests', () => {
    let initialStateTasks: TasksInitialStateType;
    const todoListID = 'todo_1';
    beforeEach(() => {
        initialStateTasks = {
            [todoListID]: [
                {
                    description: 'blabla',
                    title: 'task_1',
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: '',
                    deadline: '',
                    id: 'task_1',
                    todoListId: todoListID,
                    order: 1,
                    addedDate: '',
                },
                {
                    description: 'yo',
                    title: 'task_2',
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: '',
                    deadline: '',
                    id: 'task_2',
                    todoListId: todoListID,
                    order: 2,
                    addedDate: '',
                },
            ],
        };
    });

    it('Should add new task', () => {
        const task = {
            description: 'blabla_3',
            title: 'task_3',
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            id: 'task_3',
            todoListId: todoListID,
            order: 3,
            addedDate: '',
        };
        const newTasksState = tasksReducer(initialStateTasks, tasksActions.addTask({ task }));

        expect(newTasksState[todoListID].length).toBe(3);
        expect(newTasksState[todoListID][0].title).toBe('task_3');
        expect(newTasksState[todoListID][0].id).toBe('task_3');
    });

    it('Should remove task', () => {
        const newTasksState = tasksReducer(
            initialStateTasks,
            tasksActions.removeTask({ todoListID, taskID: 'task_1' }),
        );

        expect(newTasksState[todoListID].length).toBe(1);
        expect(newTasksState[todoListID][0].title).toBe('task_2');
    });

    it('Should update task', () => {
        const newTasksState = tasksReducer(
            initialStateTasks,
            tasksActions.updateTask({
                todoListID,
                taskID: 'task_1',
                updateModel: {
                    title: 'new_task_1',
                    deadline: 'new_deadline',
                    description: 'new_description',
                    priority: TaskPriorities.Hi,
                    startDate: 'new_startDate',
                    status: TaskStatuses.Completed,
                },
            }),
        );

        expect(newTasksState[todoListID][0].title).toBe('new_task_1');
        expect(newTasksState[todoListID][0].deadline).toBe('new_deadline');
        expect(newTasksState[todoListID][0].description).toBe('new_description');
        expect(newTasksState[todoListID][0].priority).toBe(TaskPriorities.Hi);
        expect(newTasksState[todoListID][0].startDate).toBe('new_startDate');
        expect(newTasksState[todoListID][0].status).toBe(TaskStatuses.Completed);
    });

    it('Should set tasks', () => {
        const newTasksState = tasksReducer(
            {},
            tasksActions.setTasks({ todoListID, tasks: initialStateTasks[todoListID] }),
        );

        expect(newTasksState[todoListID].length).toBe(2);
    });

    it('Should change tasks state when add new todoList', () => {
        const newTodoList: TodoListServerType = { id: 'todo_2', title: 'Added todo list', addedDate: '', order: 5 };
        const newTasksState = tasksReducer(initialStateTasks, todoListsActions.addTodoList({ todoList: newTodoList }));
        expect(Object.keys(newTasksState).length).toBe(2);
        expect(newTasksState[newTodoList.id].length).toBe(0);
    });

    it('Should change tasks state when remove todoList', () => {
        const newTasksState = tasksReducer(initialStateTasks, todoListsActions.removeTodoList({ todoListID }));
        expect(Object.keys(newTasksState).length).toBe(0);
    });

    it('Should change tasks state when set todoLists', () => {
        const newTodoList: TodoListServerType = { id: 'todo_2', title: 'Added todo list', addedDate: '', order: 5 };
        const newTasksState = tasksReducer(
            initialStateTasks,
            todoListsActions.setTodoLists({ todoLists: [newTodoList] }),
        );
        expect(newTasksState['todo_2']).toEqual([]);
    });
});
