INSERT INTO department(name)
VALUES ("Human Resources"),
       ("Accounting"),
       ("Engineering"),
       ("Customer Service"),
       ("IT Helpdesk"),
       ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES  ("HR Rep", 60000, 1),
        ("Accountant", 650000, 2),
        ("Software Engineer", 73000, 3),
        ("Customer Service Rep", 39000, 4),
        ("System Administrator", 750000, 5),
        ("Lawyer", 130000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Joseph", "Falcon", 1, NULL),
        ("Gordan", "Freeman", 3, NULL),
        ("Janet", "Hawkins", 6, NULL),
        ("Barney","Calhoun", 3, 2);