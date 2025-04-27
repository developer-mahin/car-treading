import { model, Schema } from "mongoose";
import { TSaleCar } from "./saleCar.interface";

const salesCarSchema = new Schema<TSaleCar>({
    carId: { type: Schema.Types.ObjectId, required: true, ref: 'Car' },
    dealerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
    timestamps: true
})

const SaleCar = model<TSaleCar>('SaleCar', salesCarSchema);
export default SaleCar