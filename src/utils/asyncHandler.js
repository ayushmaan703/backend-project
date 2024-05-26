const asyncHandler = (functionToBeHandled)=>async(req,res,next)=>{
    try{
       await functionToBeHandled(req,res,next)
    }
    catch(error){
        res.status(err.code||500).json({
            success : false,
            message : err.message
        })

    }
}
export default asyncHandler