import { create } from "./create";
import { forward } from "./forward";
import { getByChatId } from "./getByChatId";
import { remove } from "./remove";
import { update } from "./update";

export const messageController = {
  create,
  remove,
  forward,
  update,
  getByChatId,
};
