import mongoose from "mongoose";
const connectdb=(url)=>{
    try {
        mongoose.connect(url);
        console.log("db connected")
      } catch (err) {
        console.log(err);
      }

}
export default connectdb
