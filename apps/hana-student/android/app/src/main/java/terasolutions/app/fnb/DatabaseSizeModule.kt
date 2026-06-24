package terasolutions.app.fnb

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import java.io.File
import java.util.Locale

class DatabaseSizeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DatabaseSizeModule"
    }

    @ReactMethod
    fun getMemoryUsage(promise: Promise) {
        try {
            val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val memoryInfo = ActivityManager.MemoryInfo()
            activityManager.getMemoryInfo(memoryInfo)
            
            val runtime = Runtime.getRuntime()
            val usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024)
            val availableMemory = memoryInfo.availMem / (1024 * 1024)

            // Sử dụng WritableMap để React Native Bridge hiểu được
            val resultData = Arguments.createMap() 
            resultData.putDouble("appUsedMemory", usedMemory.toDouble())
            resultData.putDouble("systemAvailableMemory", availableMemory.toDouble())
            
            promise.resolve(resultData)
        } catch (e: Exception) {
            promise.reject("ERR_MEM", e.message)
        }
    }

    @ReactMethod
    fun getDbSize(dbName: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val actualName = if (dbName.endsWith(".db")) dbName else "$dbName.db"

            var dbFile = context.getDatabasePath(actualName)
            
            if (!dbFile.exists()) {
                dbFile = File(context.filesDir, actualName)
            }

            if (!dbFile.exists()) {
                dbFile = context.getDatabasePath(dbName)
            }

            if (dbFile.exists()) {
                val sizeMB = dbFile.length().toDouble() / (1024.0 * 1024.0)
                promise.resolve(sizeMB)
            } else {
                val files = context.databaseList().joinToString(", ")
                promise.reject("ERR_NOT_FOUND", "Không tìm thấy $actualName. Các file hiện có: $files")
            }
        } catch (e: Exception) {
            promise.reject("ERR_INTERNAL", e.message)
        }
    }
}