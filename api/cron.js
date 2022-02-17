const cron = require('node-cron');
const dateFormat = require('date-format');
const { logsSchemaModel } = require("./models/logsModel");
const { userSchemaModel } = require("./models/userModel");
const { settingsSchemaModel } = require("./models/settingsModel");
const { PublicRoomMessageSchemaModel } = require("./models/PublicRoomsMessagesModel");
const { UserSpecialPermssionSchemaModel } = require("./models/UserSpecialPermssionModel");

let logsTask;
let cronTask;

const createCronJob = () => {
    // every day 23:59 register log - calculate statistics
    logsTask = cron.schedule('01 00 * * *', async function() {
        console.log('running a task every day 23:59', dateFormat('yyyy.MM.dd hh:mm:ss.SSS', new Date()));
        try {
            const active_user_num = await userSchemaModel.find({status: "active"}).count();
            const register_user_num = await userSchemaModel.count();
            const online_user_num = await userSchemaModel.find({online: true}).count();
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const log_time = date.getTime()
            if (await logsSchemaModel.findOne({year,month,day})) {
              console.log(`already logged: ${year}-${month}-${day}`);
              return;
            }
            const logsModel = logsSchemaModel({
              date,
              log_time,
              online_user_num: online_user_num,
              register_user_num: register_user_num,
              year: year,
              month: month,
              day: day
            });
            logsModel.save();
        } catch(err) {
            console.error(err.message);
        }
        
    });

    // every minute task
    cronTask = cron.schedule('* * * * *', async function() {
      const curDate = new Date();
      // console.log('running a task every minute', dateFormat('yyyy.MM.dd hh:mm:ss.SSS', curDate));
      try {
        const parameterSettings = await settingsSchemaModel.findOne({type: "parameter"});
        const expireHour = (parameterSettings && parameterSettings.settings.top_message_save_hour) || 24;
        // announcement expire
        const announcements = await PublicRoomMessageSchemaModel.find({is_announcement: true});
        for (let i = 0; i < announcements.length; i++) {
          const createTime = announcements[i].createdAt;
          if (curDate.getTime() - createTime > expireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.findByIdAndRemove(announcements[i]._id);
          }
        }
        // top messages expire
        const topMessages = await PublicRoomMessageSchemaModel.find({top: true});
        for (let j = 0; j < topMessages.length; j++) {
          const element = topMessages[j];
          const topSetTime = element.top_set_time;
          if (curDate.getTime() - topSetTime > expireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.findByIdAndUpdate(element._id, {top: false});
          }
        }
        // public message expire
        const messageExpireHour = (parameterSettings && parameterSettings.settings.message_save_hour) || 30 * 24;
        const publicMessages = await PublicRoomMessageSchemaModel.find({top: false});
        for (let j = 0; j < publicMessages.length; j++) {
          const element = publicMessages[j];
          const createTime = element.createdAt;
          if (curDate.getTime() - createTime > messageExpireHour * 3600 * 1000) {
            await PublicRoomMessageSchemaModel.findByIdAndRemove(element._id);
          }
        }
        // user special permissio expire
        const expiredPerms = await UserSpecialPermssionSchemaModel.find({ expire_time: { $lt: Date.now() } });
        for (let k = 0; k < expiredPerms.length; k++) {
          const element = expiredPerms[k];
          await UserSpecialPermssionSchemaModel.findByIdAndRemove(element._id);
        }
      } catch(err) {
        console.error(err.message);
      }
  });
};

const initCron = async () => {
  createCronJob();
};

const stopCron = async () => {
  await logsTask.stop();
  await cronTask.stop();
};

module.exports = {
  initCron,
  stopCron
};