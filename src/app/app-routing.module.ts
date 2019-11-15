import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'default', loadChildren: './pages/default/default.module#DefaultPageModule'},
  {path: 'online', loadChildren: './pages/online/online.module#OnlinePageModule'},
  {path: 'offline', loadChildren: './pages/offline/offline.module#OfflinePageModule'},
  {path: 'offlineGame', loadChildren: './pages/offline/offline-game/offline-game.module#OfflineGamePageModule'},
  {path: 'vocList', loadChildren: './pages/offline/voclist/voclist.module#VoclistPageModule'},
  {path: 'username', loadChildren: './pages/username/username.module#UsernamePageModule'},
  {path: 'trainingsGame', loadChildren: './pages/trainings-game/trainings-game.module#TrainingsGamePageModule'},
  {path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule'},
  {path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule'},
  {path: 'beforeOneVsOneGame', loadChildren: './pages/online/before-onevsone-game/before-onevsone-game.module#BeforeOnevsoneGamePageModule'},
  {path: 'createVoc', loadChildren: './pages/offline/create-voc/create-voc.module#CreateVocPageModule'},
  {path: 'englishLeague', loadChildren: './pages/online/english-league/english-league.module#EnglishLeaguePageModule'},
  {path: 'league', loadChildren: './pages/online/league/league.module#LeaguePageModule'},
  {path: 'leagueGame', loadChildren: './pages/online/league-game/league-game.module#LeagueGamePageModule'},
  {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  {path: 'name', loadChildren: './pages/name/name.module#NamePageModule'},
  {
    path: 'offlineEasyModusGame',
    loadChildren: './pages/offline/offline-easy-modus-game/offline-easy-modus-game.module#OfflineEasyModusGamePageModule'
  },
  {
    path: 'offlineTrainingsGame',
    loadChildren: './pages/offline/offline-trainings-game/offline-trainings-game.module#OfflineTrainingsGamePageModule'
  },
  {path: 'oneVsOne', loadChildren: './pages/online/onevsone/onevsone.module#OnevsonePageModule'},
  {path: 'oneVsOneChoice', loadChildren: './pages/online/onevsone-choice/onevsone-choice.module#OnevsoneChoicePageModule'},
  {path: 'oneVsOneGame', loadChildren: './pages/online/onevsone-game/onevsone-game.module#OnevsoneGamePageModule'},
  {path: 'statsOffline', loadChildren: './pages/offline/stats-offline/stats-offline.module#StatsOfflinePageModule'},
  {path: 'game-decision', loadChildren: './pages/offline/game-decision/game-decision.module#GameDecisionPageModule'},
  {path: 'online-list', loadChildren: './pages/online/online-list/online-list.module#OnlineListPageModule'},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
