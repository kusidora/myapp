use rusqlite::{params, Connection};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn add_to_database(id: i32, text: String) -> String {
    let conn = Connection::open("my_database.db").map_err(|e| e.to_string());

    let conn = match conn {
        Ok(conn) => conn,
        Err(err) => return format!("エラーが発生={}", err),
    };

    // テーブルが存在しない場合に作成
    if let Err(err) = conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )",
        [],
    ) {
        return format!("エラーが発生: {}", err);
    }

    // データを挿入
    if let Err(err) = conn.execute(
        "INSERT INTO users (name, age) VALUES (?1, ?2)",
        params![id, text],
    ) {
        return format!("エラーが発生: {}", err);
    }

    "データが正常に追加されました".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![add_to_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
