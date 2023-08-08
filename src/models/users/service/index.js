import database from "../../../database.js";

export class UserService{
    //findbyid create findmany delete update
    async checkUserByEmail(email){
        const user = await database.user.findUnique({
            where:{
                email,
            },
        });
        if(!user) return false;
        else return user;
    };
    async findUserById(id){
        const user = await database.user.findUnique({
            where:{
                id,
            },
        });
        if(!user){
            throw{status: 404, message: "유저를 찾을 수 없습니다."};
            return user;
        };
    };
    async findUsers({skip,take}){
        const users = await database.user.findMany({
            skip,
            take,
        });
        const count = await database.user.count();
        return {
            users,
            count
        };
    };
    async createUser(props){
        const newUser = await database.user.create({
            data:{
                name: props.name,
                email: props.email,
                age: props.age,
                phoneNumber: props.phoneNumber,
                password: props.password,
            },
        });

        return newUser.id;
    };
    async deleteUser(id){
        const isExist = await database.user.findUnique({
            where:{
                id,
            },
        });
        if(!isExist) throw{status: 404, message: "유저를 찾을 수 없습니다."};

        await database.user.delete({
            where: {
                id: isExist.id,
            },
        });
    };
    async updateUser(id,props){
        const isExist = await database.user.findUnique({
            where:{
                id,
            },
        });
        if(!isExist) throw{status: 404, message: "유저를 찾을 수 없습니다."};

        await database.user.update({
            where:{
                id: isExist.id,
            },
            data: {
                name: props.name,
                email: props.email,
                age: props.age,
                phoneNumber: props.phoneNumber,
                password: props.password,
            }
        })
    };
    // prisma에서는 값이 undefinde면 변화가 없다. 
    // 즉 props.name이 undefined면 저 값은 아무일도 발생하지 않음
}