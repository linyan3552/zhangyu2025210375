#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_TODOS 100
#define MAX_TITLE_LENGTH 100
#define MAX_DESCRIPTION_LENGTH 200

// 待办事项结构体
typedef struct {
    int id;
    char title[MAX_TITLE_LENGTH];
    char description[MAX_DESCRIPTION_LENGTH];
    bool completed;
} Todo;

// 全局变量
Todo todos[MAX_TODOS];
int todo_count = 0;
int next_id = 1;

// 函数声明
void add_todo(const char* title, const char* description);
void list_todos(void);
void mark_completed(int todo_id);
void delete_todo(int todo_id);
void print_menu(void);
void clear_input_buffer(void);

int main() {
    char command[50];
    char title[MAX_TITLE_LENGTH];
    char description[MAX_DESCRIPTION_LENGTH];
    int todo_id;
    
    printf("🎯 欢迎使用待办事项应用!\n");
    print_menu();
    
    while (1) {
        printf("\n请输入命令: ");
        
        // 读取命令
        if (fgets(command, sizeof(command), stdin) == NULL) {
            clear_input_buffer();
            continue;
        }
        
        // 移除换行符
        command[strcspn(command, "\n")] = 0;
        
        // 处理命令
        if (strcmp(command, "exit") == 0) {
            printf("👋 感谢使用待办事项应用!\n");
            break;
        } else if (strcmp(command, "list") == 0) {
            list_todos();
        } else if (strncmp(command, "add", 3) == 0) {
            // 跳过"add "前缀
            char* rest = command + 4;
            
            if (*rest == '\0') {
                printf("❌ 请提供待办事项标题\n");
                continue;
            }
            
            // 查找标题和描述的分隔符（第一个空格）
            char* space_pos = strchr(rest, ' ');
            
            if (space_pos != NULL) {
                // 有描述
                *space_pos = '\0';  // 分割标题和描述
                strncpy(title, rest, MAX_TITLE_LENGTH - 1);
                title[MAX_TITLE_LENGTH - 1] = '\0';
                strncpy(description, space_pos + 1, MAX_DESCRIPTION_LENGTH - 1);
                description[MAX_DESCRIPTION_LENGTH - 1] = '\0';
            } else {
                // 只有标题
                strncpy(title, rest, MAX_TITLE_LENGTH - 1);
                title[MAX_TITLE_LENGTH - 1] = '\0';
                description[0] = '\0';
            }
            
            add_todo(title, description);
        } else if (strncmp(command, "done", 4) == 0) {
            // 跳过"done "前缀
            char* rest = command + 5;
            
            if (*rest == '\0') {
                printf("❌ 请提供待办事项ID\n");
                continue;
            }
            
            todo_id = atoi(rest);
            if (todo_id == 0) {
                printf("❌ 请输入有效的数字ID\n");
                continue;
            }
            
            mark_completed(todo_id);
        } else if (strncmp(command, "delete", 6) == 0) {
            // 跳过"delete "前缀
            char* rest = command + 7;
            
            if (*rest == '\0') {
                printf("❌ 请提供待办事项ID\n");
                continue;
            }
            
            todo_id = atoi(rest);
            if (todo_id == 0) {
                printf("❌ 请输入有效的数字ID\n");
                continue;
            }
            
            delete_todo(todo_id);
        } else {
            printf("❌ 未知命令，请重试\n");
            print_menu();
        }
    }
    
    return 0;
}

// 添加新的待办事项
void add_todo(const char* title, const char* description) {
    if (todo_count >= MAX_TODOS) {
        printf("❌ 待办事项列表已满\n");
        return;
    }
    
    Todo new_todo;
    new_todo.id = next_id++;
    strncpy(new_todo.title, title, MAX_TITLE_LENGTH - 1);
    new_todo.title[MAX_TITLE_LENGTH - 1] = '\0';
    strncpy(new_todo.description, description, MAX_DESCRIPTION_LENGTH - 1);
    new_todo.description[MAX_DESCRIPTION_LENGTH - 1] = '\0';
    new_todo.completed = false;
    
    todos[todo_count++] = new_todo;
    printf("✅ 已添加待办事项 #%d: %s\n", new_todo.id, new_todo.title);
}

// 列出所有待办事项
void list_todos(void) {
    if (todo_count == 0) {
        printf("📋 当前没有待办事项\n");
        return;
    }
    
    printf("\n📋 待办事项列表：\n");
    printf("%s\n", "==================================================");
    
    for (int i = 0; i < todo_count; i++) {
        const char* status = todos[i].completed ? "✅" : "🔄";
        printf("%s #%d: %s\n", status, todos[i].id, todos[i].title);
        
        if (todos[i].description[0] != '\0') {
            printf("   描述: %s\n", todos[i].description);
        }
        
        printf("%s\n", "--------------------------------------------------");
    }
}

// 标记待办事项为已完成
void mark_completed(int todo_id) {
    for (int i = 0; i < todo_count; i++) {
        if (todos[i].id == todo_id) {
            todos[i].completed = true;
            printf("✅ 已标记待办事项 #%d 为已完成\n", todo_id);
            return;
        }
    }
    
    printf("❌ 未找到待办事项 #%d\n", todo_id);
}

// 删除待办事项
void delete_todo(int todo_id) {
    for (int i = 0; i < todo_count; i++) {
        if (todos[i].id == todo_id) {
            // 从数组中删除元素
            printf("🗑️  已删除待办事项 #%d: %s\n", todo_id, todos[i].title);
            
            for (int j = i; j < todo_count - 1; j++) {
                todos[j] = todos[j + 1];
            }
            
            todo_count--;
            return;
        }
    }
    
    printf("❌ 未找到待办事项 #%d\n", todo_id);
}

// 打印菜单
void print_menu(void) {
    printf("可用命令:\n");
    printf("  add <标题> [描述] - 添加新待办事项\n");
    printf("  list - 查看所有待办事项\n");
    printf("  done <ID> - 标记待办事项为已完成\n");
    printf("  delete <ID> - 删除待办事项\n");
    printf("  exit - 退出应用\n");
    printf("%s\n", "==================================================");
}

// 清除输入缓冲区
void clear_input_buffer(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}