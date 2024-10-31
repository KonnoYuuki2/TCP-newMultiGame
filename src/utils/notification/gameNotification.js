import { config } from "../../config/config.js";
import { PACKET_TYPE } from "../../constants/header.js";
import { gameId } from "../../init/index.js";
import { getProtoMessage } from "../../init/loadProto.js";
import { getGameSession } from "../../sessions/game/gameSessions.js";
import { getUserById } from "../../sessions/user/userSessions.js";

export const makeNotificationPacket = (packet, type) => {
  const packetTotalLength =
    config.packet.TOTAL_LENTGTH +
    config.packet.PACKET_TYPE_LENGTH +
    packet.length;

  const Length = Buffer.alloc(config.packet.TOTAL_LENTGTH);
  Length.writeUInt32BE(packetTotalLength, 0);

  const typeLength = Buffer.alloc(config.packet.PACKET_TYPE_LENGTH);
  typeLength.writeUInt8(type, 0);

  return Buffer.concat([Length, typeLength, packet]);
};

export const createLocationPacket = (users) => {
  const protoMessage = getProtoMessage();

  const Packet = protoMessage.location.LocationUpdate;

  const payload = { users };
  const message = Packet.create(payload);
  const packet = Packet.encode(message).finish();

  return makeNotificationPacket(packet, PACKET_TYPE.LOCATION);
};

export const createPingPacket = (timestamp) => {
  const protoMessage = getProtoMessage();

  const ping = protoMessage.common.Ping;

  const game = getGameSession(gameId);
  const latency = game.getMaxLatency();

  //console.log(`핑인데`, ping);
  const payload = { timestamp, latency };
  const message = ping.create(payload);

  const pingPacket = ping.encode(message).finish();

  return makeNotificationPacket(pingPacket, PACKET_TYPE.PING);
};
