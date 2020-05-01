const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // 유저의 room 접근 검증
    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(!name || !room) return { error: '사용자 이름과 방이 필요하다.' };
    if(existingUser) return { error: '사용자 이름을 선택하십시오.' };

    const user = { id, name, room };

    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };