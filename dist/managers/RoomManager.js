"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(user1, user2) {
        console.log("on createRoom");
        const roomId = this.generate().toString();
        this.rooms.set(roomId, {
            user1,
            user2
        });
        console.log(this.rooms);
        user1.socket.emit("send-offer", ({ roomId }));
        user2.socket.emit("send-offer", ({ roomId }));
    }
    onOffer(roomId, sdp, senderSocketId) {
        console.log("on offer");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit('offer', {
            sdp,
            roomId
        });
    }
    deleteRoom(user) {
        var _a, _b;
        let roomId;
        console.log("on DeleteRoom");
        for (const [key, value] of this.rooms.entries()) {
            if (value.user1 == user || value.user2 == user) {
                roomId = key;
                break;
            }
        }
        if (roomId) {
            const user1 = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.user1;
            const user2 = (_b = this.rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.user2;
            user1 === null || user1 === void 0 ? void 0 : user1.socket.emit('exit');
            user2 === null || user2 === void 0 ? void 0 : user2.socket.emit('exit');
            this.rooms.delete(roomId === null || roomId === void 0 ? void 0 : roomId.toString());
        }
    }
    onAnswer(roomId, sdp, senderSocketId) {
        console.log("on Answer");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit('answer', {
            sdp,
            roomId
        });
    }
    onIceCandidate(roomId, senderSocket, candidate, type) {
        console.log("on onIceCandidate");
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocket ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit('add-Ice-Candidate', { candidate, type });
    }
    generate() {
        return GLOBAL_ID++;
    }
}
exports.RoomManager = RoomManager;
