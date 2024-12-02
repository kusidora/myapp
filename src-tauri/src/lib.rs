use rusqlite::{params, Connection};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn add_to_database(id: i64, text: String, is_complete: bool) -> String {
    let conn = Connection::open("my_database.db").map_err(|e| e.to_string());
    let conn = match conn {
        Ok(conn) => conn,
        Err(err) => return format!("エラーが発生={}", err),
    };

    // テーブルが存在しない場合に作成
    if let Err(err) = conn.execute(
        "CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            is_complete BOOLEAN NOT NULL
        )",
        [],
    ) {
        return format!("エラーが発生: {}", err);
    }

    // データを挿入
    if let Err(err) = conn.execute(
        "INSERT INTO todos (id, text, is_complete) VALUES (?1, ?2, ?3)",
        params![id, text, is_complete],
    ) {
        return format!("エラーが発生: {}", err);
    }

    println!("データが正常に追加されました");
    "データが正常に追加されました".to_string()
}

// #[tauri::command]
// fn get_to_database() -> Vec<Vec<String>> {
//     let v: Vec<Vec<String>> = vec![vec![]];

//     let conn = Connection::open("my_database.db").map_err(|e| e.to_string());
//     let conn = match conn {
//         Ok(conn) => conn,
//         // Err(err) => return format!("エラーが発生={}", err),
//         Err(_) => panic!("err"),
//     };

//     // テーブルが存在しない場合に作成
//     let result = conn.execute("select id,text,is_complete todos", []);
//     let _ = match result {
//         Ok(col) => col,
//         Err(e) => panic!("{}", e),
//     };

//     // let v: Vec<String> = vec![];
//     // println!("{:?}", v);
//     v
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        // .invoke_handler(tauri::generate_handler![add_to_database, get_to_database])
        .invoke_handler(tauri::generate_handler![add_to_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
