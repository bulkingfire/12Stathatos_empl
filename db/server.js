const express = require("express");

const SQL123 = require("mysql2");

const inquirer = require("inquirer");


const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = SQL123.createConnection(
  {
    host: "127.0.0.1",
  
    user: "root",
    port: 3310,
   
    password: "",
    database: "employe1234_db",
  },
  console.log(`You are connected to the employe1234_db database.`)
);

db.connect((err) => {
  if (err) throw err;
});


app.use((req, res) => {
  res.status(404).end();
});

const questions = [
  {
    type: "list",
    message: "Please choose ? (use arrow keys)",
    name: "contact",
    choices: [
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "QUIT",
      "View All Employees",
    ],
  },
];


function writeToFile(fileName, data) {
  fs.writeFileSync(fileName, data, (err) =>
    err ? console.error(err) : console.log("Success!")
  );
}

function init() {
  inquirer.prompt(questions).then((answers) => {
    if (answers.contact === "View All Departments") {
      viewDept();
    } else if (answers.contact === "View All Roles") {
      viewRoles();
    } else if (answers.contact === "View All Employees") {
      viewEmps();
    } else if (answers.contact === "Add Department") {
      addDept();
    } else if (answers.contact === "Add Role") {
      addRole();
    } else if (answers.contact === "Update Employee Role") {
      updateRole();
    }
    function viewDept() {
  
      db.query("SELECT * FROM department", function (err, results) {
        console.table(results);
        if (err) console.err(err);

        init();
      });
    }
   
    function viewRoles() {
      db.query("SELECT * FROM roles", function (err, results) {
        console.table(results);
        if (err) console.err(err);

        init();
      });
    }

    function viewEmps() {
      db.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
        if (err) console.err(err);
        init();
      });
    }
  });
  function addDept() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "what department are you looking for ?",
        },
      ])
      .then((answers) => {
        db.query(
          'INSERT INTO department(dept_name) VALUES ("' + answers.name + '")',
          function (err, results) {
            console.table(results);
            if (err) console.err(err);
            init();
          }
        );
      });
  }
  function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "role?",
        },
        {
          type: "input",
          name: "dept_name",
          message: "in this role what department?",
        },
        {
          type: "input",
          name: "salary",
          message: "salary?",
        },
      ])
      .then((answers) => {
        db.query(
          `INSERT INTO roles(job_title, role_dept, salary) VALUES ("${answers.name}", "${answers.dept_name}", "${answers.salary}" )`,
          function (err, results) {
            console.table(results);
            if (err) console.err(err);
            init();
          }
        );
      });
  }
  function updateRole() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "name?",
          choices: [],
         
        },
        {
          type: "list",
          name: "role",
          message: "what role should we assign?",
          choices: ["Engineering", "Finance", "Legal", "Sales", "Services"],
        
        },
      ])
      .then((answers) => {
        db.query(
          `UPDATE employee SET(job_title, role_dept) = ("${answers.name}", "${answers.role}", "${answers.salary}" ) WHERE =  `,
          function (err, results) {
            console.table(results);
            if (err) console.err(err);
            init();
          }
        );
      
      });
  }
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

init();
