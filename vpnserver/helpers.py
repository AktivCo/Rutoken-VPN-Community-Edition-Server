from vpnserver.models import TaskStatus


def set_taskstatus_finished():
    task = TaskStatus.objects.get(pk=1)
    if task.type is TaskStatus.NONE_TYPE:
        task.type = TaskStatus.UPDATE_TYPE
    task.status = TaskStatus.FINISHED
    task.description = None
    task.save()


def set_taskstatus_init():
    task = TaskStatus.objects.get(pk=1)
    if task.type is TaskStatus.NONE_TYPE:
        task.type = TaskStatus.UPDATE_TYPE
    task.status = TaskStatus.INIT
    task.save()

def set_taskstatus_description(description):
    task = TaskStatus.objects.get(pk=1)
    task.description = description
    task.save()


