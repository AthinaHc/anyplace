package cy.ac.ucy.cs.anyplace.smas

import androidx.lifecycle.asLiveData
import cy.ac.ucy.cs.anyplace.lib.android.AnyplaceApp
import cy.ac.ucy.cs.anyplace.lib.android.LOG
import cy.ac.ucy.cs.anyplace.lib.android.extensions.TAG
import cy.ac.ucy.cs.anyplace.smas.data.store.ChatPrefsDataStore
import cy.ac.ucy.cs.anyplace.smas.data.store.ChatUserDataStore
import cy.ac.ucy.cs.anyplace.smas.utils.network.RetrofitHolderChat
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class SmasApp : AnyplaceApp() {

  /** SMAS Chat Server preferences */
  @Inject lateinit var chatPrefsDS: ChatPrefsDataStore
  /** Logged-in SMAS user */
  @Inject lateinit var chatUserDS: ChatUserDataStore
  @Inject lateinit var rfhChat: RetrofitHolderChat

  override fun onCreate() {
    super.onCreate()
    LOG.D2()

    observeChatPrefs()
  }

  /** Manually create a new instance of the RetrofitHolder on pref changes */
  private fun observeChatPrefs() {
    val prefsChat = chatPrefsDS.read
    prefsChat.asLiveData().observeForever { prefs ->
      rfhChat.set(prefs)
      LOG.E(TAG, "Updated Chat backend URL: ${rfhChat.baseURL}")
    }
  }
}