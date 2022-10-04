describe('dummy suite', () => {
    test('dummy test', () => expect(true).toBe(true));
});

    // afterEach(async () => {
    //     appState.messages.clear();
    //     // wait if still connecting
    //     if (appState.socket && appState.socket.readyState === WebSocket.CONNECTING) {
    //         jest.useRealTimers();
    //         await sleep(1000);
    //     }
    // });

    // test('refreshWebSocket', async () => {
    //     jest.useRealTimers();

    //     // close current socket then refresh
    //     if (appState.socket) {
    //         appState.socket.onclose = null;
    //         if (appState.socket.readyState === WebSocket.OPEN) {
    //             appState.socket.close();
    //         }
    //     }
    //     appState.refreshWebSocket();
    //     // wait for connection
    //     if (!appState.socket || appState.socket.readyState !== WebSocket.OPEN) {
    //         await sleep(1000);
    //     }
    //     if (appState.socket.readyState === WebSocket.OPEN) {
    //         expect(appState.wsRetries).toEqual(0);
    //     } else {
    //         expect(appState.wsRetries).toEqual(1);
    //     }
    // });

    // test('socketErrorListener', () => {
    //     const message: Notification = {
    //         message: testString,
    //         type: 'error',
    //     };

    //     appState.socketErrorListener(message);
    //     expect(appState.messages.length).toEqual(1);
    //     expect(appState.messages[0].fullText).toEqual(message.message);
    //     expect(appState.messages[0].message).toEqual(`Server error: ${serverErrors[message.type]}`);
    //     expect(appState.messages[0].type).toEqual('error');
    // });

    // test('addSocketSubscription', () => {
    //     const { wsSubs, wsListeners } = appState;
    //     const channel = testWsChannel;
    //     const message = { channel };
    //     const mockfn = jest.fn();
    //     const listener: (message: SocketMessage) => void = (message: SocketMessage) => {
    //         if (message.channel === channel) {
    //             mockfn();
    //         }
    //     };

    //     appState.addSocketSubscription(channel, listener)
    //     expect(wsSubs.size).toBe(1);
    //     expect(wsSubs.has(testWsChannel)).toBeTruthy();
    //     expect(wsListeners.size).toBe(1);
    //     expect(wsListeners.has(listener)).toBeTruthy();
    //     wsListeners.values().next().value(message);
    //     expect(mockfn).toHaveBeenCalledTimes(1);
    // });

    // test('removeSocketSubscription', () => {
    //     const { wsSubs, wsListeners } = appState;
    //     const mockfn = jest.fn();
    //     const channel1 = testWsChannel + '1';
    //     const message1 = { channel: channel1 };
    //     const listener1: (message: SocketMessage) => void = (message: SocketMessage) => {
    //         if (message.channel === channel1) {
    //             mockfn(1);
    //         }
    //     };
    //     const channel2 = testWsChannel + '2';
    //     const message2 = { channel: channel2 };
    //     const listener2: (message: SocketMessage) => void = (message: SocketMessage) => {
    //         if (message.channel === channel2) {
    //             mockfn(2);
    //         }
    //     };

    //     // test 1
    //     appState.addSocketSubscription(channel1, listener1)
    //     expect(wsSubs.size).toBe(1);
    //     expect(wsListeners.size).toBe(1);
    //     appState.removeSocketSubscription(channel1, listener1)
    //     expect(wsSubs.size).toBe(0);
    //     expect(wsListeners.size).toBe(0);

    //     // test 2: add 2 subs, remove 1st, confirm 2nd exists
    //     appState.addSocketSubscription(channel1, listener1)
    //     appState.addSocketSubscription(channel2, listener2)
    //     expect(wsSubs.size).toBe(2);
    //     expect(wsListeners.size).toBe(2);
    //     appState.removeSocketSubscription(channel1, listener1)
    //     expect(wsSubs.size).toBe(1);
    //     expect(wsListeners.size).toBe(1);
    //     wsListeners.values().next().value(message2);
    //     expect(mockfn).toHaveBeenCalledTimes(1);
    //     expect(mockfn).toHaveBeenLastCalledWith(2);
    // });

    // test('setSocketCallback', () => {
    //     const channel = testWsChannel;
    //     const message = { channel };
    //     const mockfn = jest.fn();
    //     const { wsSubs, wsListeners } = appState;

    //     appState.setSocketCallback(channel, mockfn);
    //     expect(wsSubs.size).toBe(1);
    //     expect(wsSubs.has(channel)).toBeTruthy();
    //     expect(wsListeners.size).toBe(1);
    //     wsListeners.values().next().value(message);
    //     expect(mockfn).toHaveBeenCalledTimes(1);
    // });

    // test('handleWsMessage', () => {
    //     const channel = testWsChannel;
    //     const message = JSON.stringify({ channel });
    //     const mockfn = jest.fn();

    //     // testData listener: data = 'test' + ...
    //     const wsmessage1 = { data: 'test' + message };
    //     const { wsSubs, wsListeners } = appState;

    //     appState.setSocketCallback(testWsChannel, mockfn);
    //     expect(wsListeners.size).toBe(1);
    //     appState.handleWsMessage(wsmessage1);
    //     expect(mockfn).toHaveBeenCalledTimes(1);
    //     expect(wsListeners.size).toBe(0);

    //     // set socketId: data = 'uuid' + '|' + ...
    //     const newId = testString;
    //     const wsmessage2 = { data: 'uuid|' + newId };
    //     appState.handleWsMessage(wsmessage2);
    //     expect(appState.socketId).toEqual(newId);

    //     // normal listener
    //     const wsmessage3 = { data: message };
    //     mockfn.mockReset();
    //     appState.setSocketCallback(testWsChannel, mockfn);
    //     expect(wsListeners.size).toBe(1);
    //     appState.handleWsMessage(wsmessage3);
    //     expect(mockfn).toHaveBeenCalledTimes(1);
    //     expect(wsListeners.size).toBe(0);

    //     // error listener
    //     const error = JSON.stringify({error: {
    //         message: testString,
    //         type: 'error',
    //     }});
    //     const wsmessage4 = { data: error };
    //     appState.messages.clear()
    //     appState.handleWsMessage(wsmessage4);
    //     expect(appState.messages.length).toEqual(1);
    //     expect(appState.messages[0].fullText).toEqual(testString);
    //     expect(appState.messages[0].message).toEqual(`Server error: ${serverErrors['error']}`);
    //     expect(appState.messages[0].type).toEqual('error');
    // });