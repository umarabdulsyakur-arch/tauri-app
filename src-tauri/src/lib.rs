use std::path::Path;

use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Menyalin berkas lampiran ke folder `attachments/` di direktori data
/// aplikasi, lalu mengembalikan path tujuannya. Hanya path yang disimpan
/// di database (bukan isi berkasnya).
#[tauri::command]
fn save_attachment(app: tauri::AppHandle, source_path: String) -> Result<String, String> {
    let source = Path::new(&source_path);
    let extension = source
        .extension()
        .and_then(|s| s.to_str())
        .unwrap_or("bin");

    let app_data = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let attachments_dir = app_data.join("attachments");
    std::fs::create_dir_all(&attachments_dir).map_err(|e| e.to_string())?;

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let destination = attachments_dir.join(format!("lampiran_{}.{}", timestamp, extension));

    std::fs::copy(source, &destination).map_err(|e| e.to_string())?;
    Ok(destination.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, save_attachment])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
