const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employees_db",
  },
  console.log("Connected to the employees_db database.")
);

const promptInit = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
        //   "Delete an Employee"
        ],
      },
    ])
    .then((data) => {
      switch (data.start) {
        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Add a Department":
          promptDepartment();
          break;

        case "Add a Role":
          promptRole();
          break;

        case "Add an Employee":
          promptAddEmployee();
          break;

        case "Update Employee Role":
          promptUpdateEmployee();
          break;

        // case "Delete an Employee":
        // promptDeleteEmployee();
        // break;
      }
    });
};
const promptEnd = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "back",
        message: "Would you like to return to the main menu?",
        choices: ["Yes(Main Menu)", "No (Exit Application)"],
      },
    ])
    .then((data) => {
      switch (data.back) {
        case "Yes(Main Menu)":
          promptInit();
          break;
        case "No (Exit Application)":
          process.exit();
      }
    });
};
const promptDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Please enter the name of the department you wish to add",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO department SET ?`,
        { name: data.addDepartment },
        (err, result) => {
          if (err) {
            console.log(err);
          }
          viewDepartments();
        }
      );
    });
};
const promptRole = () => {
  let departmentList = [];
  db.query(`SELECT * FROM department;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.map((depName) => {
      departmentList.push(depName.name);
    });
    return departmentList;
  });
  return inquirer
    .prompt([
      {
        type: "input",
        name: "addRole",
        message: "Please enter the name of the role you wish to add",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this role belong to?",
        choices: departmentList,
      },
    ])
    .then((data) => {
      const departmentID = departmentList.indexOf(data.department) + 1;
      db.query(
        ` INSERT INTO role SET ?`,
        {
          title: data.addRole,
          salary: data.roleSalary,
          department_id: departmentID,
        },
        (err, result) => {
          if (err) {
            console.log(err);
          }
          viewRoles();
        }
      );
    });
};
const promptAddEmployee = () => {
  let roleList = [];
  let managerList = [];
  db.query(`SELECT * FROM role;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.map((roleName) => {
      roleList.push(roleName.title);
    });
    return roleList;
  });
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      result.map((managerName) => {
        managerList.push(`${managerName.first_name} ${managerName.last_name}`);
      });
      return managerList;
    }
  );
  return inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirst",
        message: "Please enter the first name of the employee you wish to add",
      },
      {
        type: "input",
        name: "employeeLast",
        message: "Please enter the last name of the employee",
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is this employee's role?",
        choices: roleList,
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is this employee's manager?",
        choices: managerList,
      },
    ])
    .then((data) => {
      const managerID = managerList.indexOf(data.employeeManager) + 1;
      const roleID = roleList.indexOf(data.employeeRole) + 1;
      db.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: data.employeeFirst,
          last_name: data.employeeLast,
          role_id: roleID,
          manager_id: managerID,
        },
        (err, result) => {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
};
const promptUpdateEmployee = () => {
  let employeeList = [];
  let roleList = [];
  db.query(`SELECT first_name, last_name FROM employee;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.map((employee) => {
      employeeList.push(`${employee.first_name} ${employee.last_name}`);
    });
    return employeeList;
  });
  db.query(`SELECT * FROM role;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.map((roleName) => {
      roleList.push(roleName.title);
    });
    return roleList;
  });
  return inquirer
    .prompt([
      {
        type: "input",
        name: "stupid",
        message: "Accessing Employee Database. Press Enter to Continue.",
      },
      {
        type: "list",
        name: "employees",
        message: "Select which employee to update",
        choices: employeeList,
      },
      {
        type: "list",
        name: "roles",
        message: "What is their new role",
        choices: roleList,
      },
    ])
    .then((data) => {
      const roleID = roleList.indexOf(data.roles) + 1;
      const employeeID = employeeList.indexOf(data.employees) + 1;
      db.query(
        `UPDATE employee SET role_id=${roleID} WHERE id = ${employeeID}`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
};
// ****Delete function*** Commented out because it doesn't fully work

// const promptDeleteEmployee = () => {
//     let employeeList = [];
//     db.query(`SELECT first_name, last_name FROM employee;`, (err,result) =>{
//         if(err){
//             console.log(err);
//         }
//         result.map((employee)=> {
//            employeeList.push(`${employee.first_name} ${employee.last_name}`)
//         });
//         return employeeList;
//     });
//     return inquirer
//     .prompt([
//         {
//             type: "confirm",
//             name: "confirm",
//             message: "Please note this will permanently delete an employee. Continue?"
//         },
//         {
//             type: "list",
//             name: "employees",
//             message: "Which employee would you like to delete?",
//             when: (data)=> data.confirm === true,
//             choices: employeeList
//         }
//     ])
//     .then((data)=>{
//         if(data.confirm === false){
//             promptInit();
//          }
//         const employeeID = employeeList.indexOf(data.employees) + 1
//         console.log(employeeID)
//         db.query("DELETE FROM employee WHERE id =?",employeeID, (err,result)=>{
//             if(err){
//                 console.log(err);
//             }
//             viewEmployees();
//         });
//     });
// };

const viewDepartments = () => {
  db.query("SELECT * FROM department;", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    promptEnd();
  });
};
const viewRoles = () => {
  db.query("SELECT * FROM role;", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    promptEnd();
  });
};
const viewEmployees = () => {
  const query = `SELECT 
    employee.id, employee.first_name, employee.last_name , role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    promptEnd();
  });
};

promptInit();
