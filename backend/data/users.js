import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        name: "Natasa Kefer",
        email: "natasa@email.com",
        password: bcrypt.hashSync("Natasa123.", 10),
        isAdmin: false,
    },
    {
        name: "Petar Petrovic",
        email: "petar@email.com",
        password: bcrypt.hashSync("Petar123.", 10),
        isAdmin: false,
    }
];

export default users;