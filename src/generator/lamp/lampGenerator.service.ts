import { LampDocument } from './lamp.entity';
import { Model, Types } from 'mongoose';

const possibleStatus = ['light', 'dark'];
export default function lampGenerator(
  lampModel: Model<LampDocument>,
  lampId: Types.ObjectId,
) {
  lampModel.findOne({ _id: lampId }).then(async (lamp) => {
    if (lamp == null) return;
    if (lamp.status == null) return;
    const currentStatus = lamp.status;
    // console.log(lamp);
    await lampModel.findOneAndUpdate(
      {
        _id: lampId,
      },
      {
        $set: {
          status: changeStatusRandomly(currentStatus),
        },
      },
    );
  });
}

function changeStatusRandomly(status: string): string {
  try {
    if (Math.floor(Math.random() * 2) == 1) {
      const changedStatus = possibleStatus.filter((s) => s != status)[0];
      // 10% 확률로 가로등 현재 상태 변경
      return changedStatus;
    }
    return status;
  } catch (ignore) {
    return status;
  }
}
