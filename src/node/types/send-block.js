const sendBlock = async (_message) => {
    const block = _message.data
    if (ENABLE_CHAIN_REQUEST && currentSyncBlock === block.blockNumber) {
        fastify.log.info("REQUEST_BLOCK* from peer. Verifying...")
        if (chainInfo.latestSyncBlock === null || await verifyBlock(block, chainInfo, stateDB, codeDB, ENABLE_LOGGING)) {
            fastify.log.info("Block verified. Syncing to the chain...")
            currentSyncBlock += 1
            await blockDB.put(block.blockNumber.toString(), block)
            await bhashDB.put(block.hash, block.blockNumber.toString())
            if (!chainInfo.latestSyncBlock) {
                chainInfo.latestSyncBlock = block
                await changeState(block, stateDB, codeDB, ENABLE_LOGGING)
            }
            chainInfo.latestBlock = block
            await updateDifficulty(block, chainInfo, blockDB)
            fastify.log.info(`Synced at height #${block.blockNumber}, chain state transited.`)

            for (const node of opened) {
                node.socket.send(produceMsg(TYPE.REQUEST_BLOCK,{ blockNumber: currentSyncBlock, requestAddress: MY_ADDRESS }))
                await new Promise(r => setTimeout(r, 5000))
            }
        }
    }
    
}