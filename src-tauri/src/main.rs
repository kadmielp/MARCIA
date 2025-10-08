// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct AppSettings {
    ai_provider: String,
    api_keys: HashMap<String, String>,
    ollama_url: String,
    ollama_model: String,
    selected_locale: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        let mut api_keys = HashMap::new();
        api_keys.insert("openai".to_string(), String::new());
        api_keys.insert("gemini".to_string(), String::new());
        api_keys.insert("claude".to_string(), String::new());
        api_keys.insert("maritaca".to_string(), String::new());
        
        Self {
            ai_provider: "claude".to_string(),
            api_keys,
            ollama_url: "http://localhost:11434/v1".to_string(),
            ollama_model: "llama2".to_string(),
            selected_locale: "pt-BR".to_string(),
        }
    }
}

fn get_settings_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    Ok(app_dir.join("settings.json"))
}

#[tauri::command]
fn save_settings(
    app_handle: tauri::AppHandle,
    settings: AppSettings,
) -> Result<(), String> {
    let settings_path = get_settings_path(&app_handle)?;
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(settings_path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_settings(app_handle: tauri::AppHandle) -> Result<AppSettings, String> {
    let settings_path = get_settings_path(&app_handle)?;
    
    if settings_path.exists() {
        let json = fs::read_to_string(settings_path).map_err(|e| e.to_string())?;
        let settings: AppSettings = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        Ok(settings)
    } else {
        Ok(AppSettings::default())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_settings, load_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

