use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Serialize)] // フロントエンドに JSON 形式でデータを渡すために必要
struct Todo {
    id: i64,
    text: String,
    is_complete: bool,
}

#[tauri::command]
fn add_to_database(id: i64, text: String, is_complete: bool) -> String {
    let conn = match Connection::open("my_database.db") {
        Ok(conn) => conn,
        Err(err) => return format!("データベース接続エラー: {}", err),
    };

    // テーブルを作成（存在しない場合）
    if let Err(err) = conn.execute(
        "CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            is_complete BOOLEAN NOT NULL
        )",
        [],
    ) {
        return format!("テーブル作成エラー: {}", err);
    }

    // データを挿入
    if let Err(err) = conn.execute(
        "INSERT INTO todos (id, text, is_complete) VALUES (?1, ?2, ?3)",
        params![id, text, is_complete],
    ) {
        return format!("データ挿入エラー: {}", err);
    }

    println!("データが正常に追加されました");
    "データが正常に追加されました".to_string()
}

#[tauri::command]
fn get_to_database() -> Result<Vec<Todo>, String> {
    let conn = match Connection::open("my_database.db") {
        Ok(conn) => conn,
        Err(err) => return Err(format!("データベース接続エラー: {}", err)),
    };

    let mut stmt = match conn.prepare("SELECT id, text, is_complete FROM todos") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("クエリ準備エラー: {}", err)),
    };

    let todos_iter = match stmt.query_map([], |row| {
        Ok(Todo {
            id: row.get(0)?,
            text: row.get(1)?,
            is_complete: row.get::<_, i32>(2)? != 0, // SQLite の BOOLEAN を Rust の bool に変換
        })
    }) {
        Ok(iter) => iter,
        Err(err) => return Err(format!("データ取得エラー: {}", err)),
    };

    let mut todos = Vec::new();
    for todo in todos_iter {
        match todo {
            Ok(todo) => todos.push(todo),
            Err(err) => return Err(format!("データ変換エラー: {}", err)),
        }
    }

    Ok(todos)
}

#[tauri::command]
fn delete_from_database(id: i64) -> String {
    let conn = match Connection::open("my_database.db") {
        Ok(conn) => conn,
        Err(err) => return format!("データベース接続エラー: {}", err),
    };

    if let Err(err) = conn.execute("DELETE FROM todos WHERE id = ?1", params![id]) {
        return format!("データ削除エラー: {}", err);
    }

    println!("タスク (ID: {}) が削除されました", id);
    format!("タスク (ID: {}) が削除されました", id)
}

#[tauri::command]
fn update_database(id: i64, text: Option<String>, is_complete: Option<bool>) -> String {
    let conn = match Connection::open("my_database.db") {
        Ok(conn) => conn,
        Err(err) => return format!("データベース接続エラー: {}", err),
    };

    if let Some(text) = text {
        if let Err(err) = conn.execute(
            "UPDATE todos SET text = ?1 WHERE id = ?2",
            params![text, id],
        ) {
            return format!("テキスト更新エラー: {}", err);
        }
    }

    if let Some(is_complete) = is_complete {
        if let Err(err) = conn.execute(
            "UPDATE todos SET is_complete = ?1 WHERE id = ?2",
            params![is_complete, id],
        ) {
            return format!("完了状態更新エラー: {}", err);
        }
    }

    println!("タスク (ID: {}) が更新されました", id);
    format!("タスク (ID: {}) が更新されました", id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            add_to_database,
            get_to_database,
            delete_from_database,
            update_database
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
