import User from '../users/user.model.js'
import Role from '../role/role.model.js';
import Account from '../account/account.model.js';
import Favorite from '../favorites/favorite.model.js';

export const validRole = async(role = '') => {
    if (role === "") return;  

    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`Rol ${role} does not exist in the database`);
    }
}

export const existentEmail = async(email = '')=>{
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error (`Email ${email} already exists in the database`)
    }
}

export const existUserById = async(id = ``)=>{
    const existUser = await User.findById(id);
    if (!existUser) {
        throw new Error(`ID  ${id} does not exist in the database`)
    }
}

export const existClientById = async (id = '') => {
    const existClient = await Client.findById(id);
    if(!existClient){
        throw new Error(`ID ${id} does not exist in the database`)
    }
}

export const existUsername = async(username = '') => {
    const existUsername = await User.findOne({username});
    if(existUsername){
        throw new Error(`Username ${username} already use`)
    }
}

export const existAccountById = async (id = '') => {
    const existAccount = await Account.findById(id);
    if (!existAccount) {
        throw new Error(`Account with ID ${id} does not exist in the database`);
    }
};

export const existFavoriteById = async(id = '') => {
    const existFavorite = await Favorite.findById(id);
    if (!existFavorite) {
        throw new Error(`El favorito con ID ${id} no existe en la base de datos`);
    }
};