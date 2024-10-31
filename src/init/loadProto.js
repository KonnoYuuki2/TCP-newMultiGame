import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import { packetNames } from "../protobufs/packetNames.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const protoDir = path.join(dirname, "../protobufs");

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === ".proto") {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessage = {};

export const loadProto = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(
      protoFiles.map((file) => {
        //하나 이상의 .proto 또는 전처리된 .json 파일을 이 루트 네임스페이스에 로드하고 콜백을 호출합니다.
        return root.load(file);
      })
    );

    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessage[packageName] = {};

      for (const [type, typeName] of Object.entries(types)) {
        protoMessage[packageName][type] = root.lookupType(typeName);
      }
    }

    console.log(`protobuf 파일들이 로드되었습니다.`);
  } catch (error) {
    console.error(`protobuf 파일 로드 중 오류 발생`, error);
  }
};

export const getProtoMessage = () => {
  return { ...protoMessage };
};
