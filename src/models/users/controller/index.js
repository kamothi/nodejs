import {Router} from "express";
import { pagination } from "../../../middleware/pagination.js";
import { UsersDTO,CreateUserDTO,updateUserDTO } from "../DTO/index.js";
import { UserService } from "../service/index.js";
//Router
class UserController {
    router;
    path =  "/users";
    userService;
    constructor(){
        this.router = Router();
        this.init();
        this.userService = new UserService();
    };
    init(){
        this.router.get("/",pagination,this.getUsers.bind(this));
        this.router.get("/detail/:id",this.getUser.bind(this));
        this.router.post("/",this.createUser.bind(this));
        this.router.post('/:id',this.updateUser.bind(this));
        this.router.post("/:id",this.deleteUser.bind(this));
    };
    async getUsers(req,res,next){
        try{
            const {users, count} = await this.userService.findUsers({skip:req.skip,take:req.take});
            res.status(200).json({users,count});
        }catch(err){
            next(err);
        }
    };
    async getUser(req,res,next){
        try{
            const {id} = req.params;
            const user = await this.userService.findUserById(id);
            res.status(200).json({user : new UsersDTO(user)});
        }catch(err){
            next(err);
        }
    };
    async createUser(req,res,next){
        try{
            const createUserDTO = new CreateUserDTO(req.body);
            const newUserID = await this.userService.createUser(createUserDTO);
            res.status(201).json({id: newUserID});
        }catch(err){
            next(err);
        }
    };
    async updateUser(req,res,next){
        try{
            const {id} = req.body;
            const newUpdateUserDTO = new updateUserDTO(req.body);
            await this.userService.updateUser(id,this.updateUserDTO);
            res.status(204).json({});
        }catch(err){
            next(err);
        };
    };
    async deleteUser(req,res,next){
        try{
            const {id} = req.params;
            await this.userService.deleteUser(id);
            res.status(204).json({});
        }catch(err){
            next(err);
        };
    };
};

const userController = new UserController();
export default userController;