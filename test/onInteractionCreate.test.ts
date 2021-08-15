import {Permissions} from 'discord.js'
import {assert} from 'chai'
import sinon from 'sinon'
import event from '../src/events/onInteractionCreate'
import Storage from '../src/Storage/Storage'
import replies from '../src/replies'

const ephemeral = {ephemeral: true}

describe('onInteractionCreate', () => {
  const storage = new Storage('onInteractionCreate/database.sqlite', true)
  const commands = [{name: 'start', execute: sinon.fake()}, {name: 'stop', execute: sinon.fake()}]
  const interactionDefault = {
    isCommand: () => true,
    guild: {},
    user: {
      bot: false
    },
    member: {
      permissions: new Permissions(Permissions.ALL)
    },
    commandName: 'start',
    deferReply: sinon.fake(),
    editReply: sinon.fake()
  }

  describe('Если isCommands => false', async () => {
    const interaction = {...interactionDefault, isCommand: () => false}
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт false', () => assert.isFalse(result))
    it('Не выполнит deferReply', () => assert.isTrue(interaction.deferReply.notCalled))
    it('Не выполнит editReply', () => assert.isTrue(interaction.editReply.notCalled))
    it('Не выполнит commands', () => {
      for (const command of commands) {assert.isTrue(command.execute.notCalled)}
    })
  })

  describe('Если interaction.guild == undefined', async () => {
    const interaction = {...interactionDefault, guild: undefined}
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт false', () => assert.isFalse(result))
    it('Не выполнит deferReply', () => assert.isTrue(interaction.deferReply.notCalled))
    it('Не выполнит editReply', () => assert.isTrue(interaction.editReply.notCalled))
    it('Не выполнит commands', () => {
      for (const command of commands) {assert.isTrue(command.execute.notCalled)}
    })
  })

  describe('Если interaction.user.bot == true', async () => {
    const interaction = {...interactionDefault, user: {bot: true}}
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт false', () => assert.isFalse(result))
    it('Не выполнит deferReply', () => assert.isTrue(interaction.deferReply.notCalled))
    it('Не выполнит editReply', () => assert.isTrue(interaction.editReply.notCalled))
    it('Не выполнит commands', () => {
      for (const command of commands) {assert.isTrue(command.execute.notCalled)}
    })
  })

  describe('Если interaction.member.permissions не имеет права администратора', async () => {
    const interaction = {
      ...interactionDefault,
      member: {permissions: new Permissions(Permissions.FLAGS.VIEW_CHANNEL)},
      deferReply: sinon.fake(),
      editReply: sinon.fake()
    }
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт true', () => assert.isTrue(result))
    it('Выполнит deferReply с ephemeral', () => assert.isTrue(interaction.deferReply.calledOnceWith(ephemeral)))
    it('Выполнит editReply с ONLY_ADMIN', () => assert.isTrue(interaction.editReply.calledOnceWith(replies.ONLY_ADMIN)))
    it('Не выполнит commands', () => {
      for (const command of commands) {assert.isTrue(command.execute.notCalled)}
    })
  })

  describe('Если interaction.commandName нет в списке', async () => {
    const interaction = {...interactionDefault, commandName: 'not', deferReply: sinon.fake(), editReply: sinon.fake()}
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт true', () => assert.isTrue(result))
    it('Выполнит deferReply с ephemeral', () => assert.isTrue(interaction.deferReply.calledOnceWith(ephemeral)))
    it('Выполнит editReply с NOT_FOUND_COMMAND', () => {
      assert.isTrue(interaction.editReply.calledOnceWith(replies.NOT_FOUND_COMMAND))
    })
    it('Не выполнит commands', () => {
      for (const command of commands) {assert.isTrue(command.execute.notCalled)}
    })
  })

  describe('Если команда возвращает ошибку', async () => {
    const interaction = {...interactionDefault, commandName: 'test', deferReply: sinon.fake(), editReply: sinon.fake()}
    const commandsError = [{name: 'test', execute: () => {throw new Error('test')}}]
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commandsError, storage)
    })

    it('Вернёт true', () => assert.isTrue(result))
    it('Выполнит deferReply с ephemeral', () => assert.isTrue(interaction.deferReply.calledOnceWith(ephemeral)))
    it('Выполнит editReply с COMMAND_ERROR', () => assert.isTrue(interaction.editReply.calledOnceWith(replies.COMMAND_ERROR)))
  })

  describe('Если команда исправна', async () => {
    const interaction = {...interactionDefault, deferReply: sinon.fake(), editReply: sinon.fake()}
    let result: boolean

    before(async () => {
      result = await event.execute(interaction, commands, storage)
    })

    it('Вернёт true', () => assert.isTrue(result))
    it('Выполнит deferReply с ephemeral', () => assert.isTrue(interaction.deferReply.calledOnceWith(ephemeral)))
    it('Не выполнит editReply', () => assert.isTrue(interaction.editReply.notCalled))
    it('Выполнит command start', () => assert.isTrue(commands[0].execute.calledOnceWith(interaction, storage)))
  })
})
