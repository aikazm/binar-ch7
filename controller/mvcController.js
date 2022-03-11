const { User, Biodata, User_History } = require('../models');
const bcrypt = require("bcrypt");



const Dashboard = async (req, res) => {
	try {
		const {success, error} = req.flash()

		const userList = await User.findAndCountAll({
			include: ['biodata', 'history'],
			order: [['createdAt', 'DESC']]
		})

		res.render('main', {
			pageTitle: "Dashboard Admin",
			data: userList.rows,
			success,
			error,
		});
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
	}
};


const Register = (req, res) => {
	try {
		const { success, error } = req.flash();

		res.render("register", {
			pageTitle: "Register",
			success,
			error,
		});
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
	}
};


const RegisterFunction = async (req, res) => {
	try {
		const newUser = await User.create({
            name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			role: 'PLAYER',
		})

		await Biodata.create({
			age: req.body.age,
			city: req.body.city,
			user_uuid: newUser.uuid,
		})

		await User_History.create({
			win: req.body.win,
			lose: req.body.lose,
			draw: req.body.draw,
			user_uuid: newUser.uuid,
			});

			req.flash("success", "Berhasil Registrasi. Silahkan Login");
			res.redirect("/");
		
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
		res.redirect("/register");
	}
};


const Login = (req, res) => {
	try {
		const { success, error } = req.flash();

		res.render("login", {
			headTitle: "Login",
			success,
			error,
		});
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
	}
};


const Edit = async (req, res) => {
	try {
		const { success, error } = req.flash();

		const userToEdit = await User.findOne({
			where: {
				uuid: req.params.id,
			},
			include: ["biodata", "history"],
		});

		res.render("edit", {
			headTitle: "Edit User",
			data: userToEdit,
			name: req.user ? req.user.name : null,
			success,
			error,
		});
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
	}
};


const EditFunction = async (req, res) => {
	const { name, email, password, age, address, city, win, lose, draw } = req.body;

	try {
		const userToUpdate = await User.findByPk(req.params.id);

		if (userToUpdate) {
			const biodataToUpdate = await Biodata.findOne({
				where: {
					user_uuid: req.params.id,
				},
			});

			const updatedBiodata = await biodataToUpdate.update({
				age: age === "" ? biodataToUpdate.age : age,
				address: address,
				city: city,
			});

			const historyToUpdate = await History.findOne({
				where: {
					user_uuid: req.params.id,
				},
			});

			const updatedHistory = await historyToUpdate.update({
				win: win === "" ? historyToUpdate.win : win,
				lose: lose === "" ? historyToUpdate.lose : lose,
				draw: draw === "" ? historyToUpdate.draw : draw,
			});

			const updated = await userToUpdate.update({
				name: name ?? userToUpdate.name,
				email: email ?? userToUpdate.email,
				password: password === "" ? usrToUpdate.password : bcrypt.hashSync(password, 10),
			});

			req.flash("success", "Update Berhasil");
			res.redirect('/');
		}
	} catch (error) {
		req.flash("error", error.message);
		console.log("====================================");
		console.log(error);
		console.log("====================================");
		res.redirect('/');
	}
};


const Delete = async (req, res) => {
	try {
		const userToDelete = await User.findByPk(req.params.id);

		if (userToDelete) {
			await Biodata.destroy({
				where: {
					user_uuid: req.params.id,
				},
			});

			await History.destroy({
				where: {
					user_uuid: req.params.id,
				},
			});

			const deleted = await User.destroy({
				where: {
					uuid: req.params.id,
				},
			});

			req.flash("success", "Akun Berhasil Dihapus");
			res.redirect("/");
		}
	} catch (error) {
		req.flash("error", error.message);
		console.log("====================================");
		console.log(error);
		console.log("====================================");
		res.redirect("/");
	}
};

// Controller untuk melakukan logout
const Logout = (req, res) => {
	req.logout();
	res.redirect("/login");
};

module.exports = {
	Dashboard,
	Register,
	RegisterFunction,
	Login,
	Edit,
	EditFunction,
	Delete,
	Logout
};
