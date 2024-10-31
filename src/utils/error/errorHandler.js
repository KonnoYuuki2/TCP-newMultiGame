export const handlerError = (socket, error) => {
  let responseCode;
  let message;
  console.error(error);

  if (error.code) {
    responseCode = error.code;
    message = error.message;

    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  }
};
