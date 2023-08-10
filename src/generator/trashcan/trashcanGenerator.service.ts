import { BuildingDocument } from './building.entity';
import { Model } from 'mongoose';

export default function trashcanGenerator(
  buildingModel: Model<BuildingDocument>,
  buildingId: number,
  floorId: number,
) {
  buildingModel
    .findOne(
      { buildingNumber: buildingId },
      {
        floors: { $elemMatch: { floorNumber: floorId } },
      },
    )
    .then(async (building) => {
      if (building == null) return;
      if (building.floors == null) return;
      if (building.floors[0] == null) return;
      if (building.floors[0].trashCan == null) return;
      const trashCanStatus = building.floors[0].trashCan.status;

      // console.log(building?.floors.map((i) => i.trashCan));
      await buildingModel.findOneAndUpdate(
        {
          buildingNumber: buildingId,
          'floors.floorNumber': floorId,
        },
        {
          $set: {
            'floors.$.trashCan.status': {
              regular: changeTrashCanRandomly(trashCanStatus.regular),
              bottle: changeTrashCanRandomly(trashCanStatus.bottle),
              plastic: changeTrashCanRandomly(trashCanStatus.plastic),
              paper: changeTrashCanRandomly(trashCanStatus.paper),
            },
          },
        },
      );
    });
}

function changeTrashCanRandomly(percentage: number): number {
  if (percentage == 100) {
    if (Math.floor(Math.random() * 10) == 1)
      return 0; // 10% 확률로 쓰레기통 비움
    else {
      return percentage;
    }
  } else if (80 < percentage && percentage < 100) {
    if (Math.floor(Math.random() * 10) == 1) return 0; // 10% 확률로 쓰레기통 비움
  }
  return Math.floor(Math.random() * 2) == 0 ? percentage + 1 : percentage; // 50% 확률로 쓰레기 채워짐
}
