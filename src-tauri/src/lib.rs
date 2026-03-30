use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Serialize)] // フロントエンドに JSON 形式でデータを渡すために必要
#[derive(Debug)]
#[serde(rename_all = "camelCase")]
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
    dbg!("{:?}", &todos);
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

    let mut query = String::from("UPDATE todos SET ");
    let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
    let mut updates = Vec::new();

    if let Some(text) = text {
        updates.push("text = ?");
        params_vec.push(Box::new(text));
    }

    if let Some(is_complete) = is_complete {
        updates.push("is_complete = ?");
        params_vec.push(Box::new(is_complete));
        dbg!("{}", is_complete);
    }

    // 更新対象がなければ終了
    if updates.is_empty() {
        return "更新する項目がありません".to_string();
    }

    query.push_str(&updates.join(", "));
    query.push_str(" WHERE id = ?");
    dbg!("{:?}", &query);
    params_vec.push(Box::new(id));

    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();

    if let Err(err) = conn.execute(&query, params_refs.as_slice()) {
        return format!("更新エラー: {}", err);
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
