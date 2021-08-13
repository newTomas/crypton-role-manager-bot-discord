const replies = {
  ACTIVATED: {content: 'Автоматическое назначение ролей запущено!'},
  DEACTIVATED: {content: 'Автоматическое назначение ролей остановлено!'},
  FIRST_SET_ROLE: {content: '[ОТМЕНЕНО] Сперва укажите роль участников Crypton Academy! \nИспользуйте команду: /set_role'},
  SET_ROLE: {content: '[ОТМЕНЕНО] Укажите роль!'},
  ONLY_ADMIN: {content: '[ОТМЕНЕНО] Только админ может использовать эту команду!'},
  ROLE_SHOULD_LOWER: {content: '[ОТМЕНЕНО] Назначаемая роль должна быть ниже роли бота!'},
  NOT_FOUND_COMMAND: {content: '[ОТМЕНЕНО] Такой команды не существует!'},
  COMMAND_ERROR: {content: '[ОШИБКА] При выполнении этой команды произошла неизвестная ошибка!'},
  ROLE_ASSIGNED: (nameRole: string) => ({content: `Теперь участникам Crypton Academy будет назначаться роль ${nameRole}!`}),
  INFO: (role: string | undefined, active: boolean | undefined) => {
    return {content: `Назначенная роль: ${role ?? 'Отсутствует'} \nСтатус бота: ${active ? 'Активен' : 'Неактивен'}`}
  }
}

export default replies
