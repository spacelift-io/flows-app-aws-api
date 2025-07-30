import addPermission from "./addPermission";
import cancelMessageMoveTask from "./cancelMessageMoveTask";
import changeMessageVisibility from "./changeMessageVisibility";
import changeMessageVisibilityBatch from "./changeMessageVisibilityBatch";
import createQueue from "./createQueue";
import deleteMessage from "./deleteMessage";
import deleteMessageBatch from "./deleteMessageBatch";
import deleteQueue from "./deleteQueue";
import getQueueAttributes from "./getQueueAttributes";
import getQueueUrl from "./getQueueUrl";
import listDeadLetterSourceQueues from "./listDeadLetterSourceQueues";
import listMessageMoveTasks from "./listMessageMoveTasks";
import listQueueTags from "./listQueueTags";
import listQueues from "./listQueues";
import purgeQueue from "./purgeQueue";
import receiveMessage from "./receiveMessage";
import removePermission from "./removePermission";
import sendMessage from "./sendMessage";
import sendMessageBatch from "./sendMessageBatch";
import setQueueAttributes from "./setQueueAttributes";
import startMessageMoveTask from "./startMessageMoveTask";
import tagQueue from "./tagQueue";
import untagQueue from "./untagQueue";

export const blocks = {
  addPermission,
  cancelMessageMoveTask,
  changeMessageVisibility,
  changeMessageVisibilityBatch,
  createQueue,
  deleteMessage,
  deleteMessageBatch,
  deleteQueue,
  getQueueAttributes,
  getQueueUrl,
  listDeadLetterSourceQueues,
  listMessageMoveTasks,
  listQueueTags,
  listQueues,
  purgeQueue,
  receiveMessage,
  removePermission,
  sendMessage,
  sendMessageBatch,
  setQueueAttributes,
  startMessageMoveTask,
  tagQueue,
  untagQueue,
};
