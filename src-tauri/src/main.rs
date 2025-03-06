use tauri::api::dialog::blocking::FileDialogBuilder;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_dialog])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
