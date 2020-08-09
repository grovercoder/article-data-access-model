const GroupService = require('./services/groups.js')
const TaskService = require('./services/tasks.js')

/*
  NOTES:
    1. We are using SQLite3 for this demo code.  SQLite3 does not
       support the .returning() feature of Knex.  So we cannot directly
       retrieve our new or updated records as the return value from the create()
       or update() methods.  This works with other databases and results in less
       code though.

       So, we do the create() command below, followed by a .findById() to retrieve 
       the new record.  This only works because of our this sample data.

       We do not recommend using SQLite for production applications unless you 
       know what you are doing and alter the _model.js file accordingly.

    2. This is only sample code.  Feel free to drop in console.log()'s to see 
       what is happening, or to try calling the other methods.

    3. You can reset the database between runs with the following commands:

    ```
    npm run knex migrate:rollback
    npm run knex migrate:latest
    node src/index.js
    ```

*/

// we create a "main" function that we call below so that we can
// 'await' the async functions
async function main() {
  // create a group
  await GroupService.create({ name: 'Group 1' })

  const group = await GroupService.findById(1)
  // console.log({ group })

  // create a task
  await TaskService.create({
    group_id: group.id,
    name: 'Task1',
    description: 'This is an example task',
  })
  const task1 = await TaskService.findById(1)
  // console.log({ task1 })

  // create a task with the special "run" name
  await TaskService.create({
    group_id: group.id,
    name: 'run',
    description: 'This is an example task',
  })
  const task2 = TaskService.findById(2)

  await TaskService.remove(task1.id)
}

// finally we call the main function
main()
