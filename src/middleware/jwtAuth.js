// 검증을 할거임
export const jwtAuth = async (req,res,next)=>{
    try{
        const headers = req.headers;
        const authorization = headers["Authorization"] || headers["authorization"];

        // Bearer ${token} || undefined
        // ?. 옵셔널 체이닝
        if(authorization?.includes("Bearer") || authorization?.includes("bearer")){
            if(typeof authorization === "string"){
                const bearers = authorization.split(" ");
                console.log(bearers);
                if(bearers.length === 2 && bearers[1] === "string"){
                    const accessToken = bearers[1];

                    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                    const user = await database.user.findUnique({
                        where: {
                        id: decoded.id,
                        },
                    });

                    if (user) {
                        req.user = user;
                    } else {
                        req.user = undefined;
                    }
                }
                else{
                    // 이렇게 next에 뭔가를 적으면 global error로 넘어가는거임.
                    next({ status: 400, message: "Authorization Fail" });
                }
            }else{
                next({status:400,message:"토큰이 잘못되었습니다."});
            }
        }
        else{
            next();
        }

    }catch(err){
        next({...err,status:403});
    };
};