const TWILIO_WORKSPACE = 'WS959ed11ff79851cbbe5dff030930e778';
const TWILIO_WORKFLOW_SID = 'WW46df4f1dc6410868303fbd9a6aa619a5';
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = {
  /**
   * Create a Flex task
   * @param { Object } attributes the attributes for the task.
   *  Can be accessed inside of flex
   */
  createTask: attributes => twilio.taskrouter
    .workspaces(TWILIO_WORKSPACE)
    .tasks.create({
      attributes: JSON.stringify(attributes),
      workflowSid: TWILIO_WORKFLOW_SID,
      taskChannel: 'email',
      timeout: 60 * 60 * 24 * 10, // 60 second in a minute, 60 minutes in an hour, 24 hours in a day, 10 days
    })
    .then((task) => {
      console.log('Twilio Task Created');
      return task;
    })
    .catch((error) => {
      console.error('Task not created: ', error);
      // Task Attribute Size - important to check because the is a limit to the attribute size
      const bytes = jsonString =>
          ~-encodeURI(jsonString).split(/%..|./).length; // eslint-disable-line
      console.error(
        `Task attributes size ${bytes(JSON.stringify(attributes))}: `,
        attributes,
      );
    }),
};
