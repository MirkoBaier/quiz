import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'default', loadChildren: './pages/default/default.module#DefaultPageModule', data: {preload: true}},
  {path: 'online', loadChildren: './pages/online/online.module#OnlinePageModule', data: {preload: true}},
  {path: 'offline', loadChildren: './pages/offline/offline.module#OfflinePageModule', data: {preload: true}},
  {path: 'offlineGame', loadChildren: './pages/offline/offline-game/offline-game.module#OfflineGamePageModule', data: {preload: true}},
  {path: 'vocList', loadChildren: './pages/offline/voclist/voclist.module#VoclistPageModule', data: {preload: true}},
  {path: 'username', loadChildren: './pages/username/username.module#UsernamePageModule', data: {preload: true}},
  {path: 'trainingsGame', loadChildren: './pages/trainings-game/trainings-game.module#TrainingsGamePageModule', data: {preload: true}},
  {path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule', data: {preload: true}},
  {path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule', data: {preload: true}},
  {
    path: 'beforeOneVsOneGame',
    loadChildren: './pages/online/before-onevsone-game/before-onevsone-game.module#BeforeOnevsoneGamePageModule',
    data: {preload: true}
  },
  {path: 'createVoc', loadChildren: './pages/offline/create-voc/create-voc.module#CreateVocPageModule', data: {preload: true}},
  {
    path: 'englishLeague',
    loadChildren: './pages/online/english-league/english-league.module#EnglishLeaguePageModule',
    data: {preload: true}
  },
  {path: 'league', loadChildren: './pages/online/league/league.module#LeaguePageModule', data: {preload: true}},
  {path: 'leagueGame', loadChildren: './pages/online/league-game/league-game.module#LeagueGamePageModule', data: {preload: true}},
  {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', data: {preload: true}},
  {path: 'name', loadChildren: './pages/name/name.module#NamePageModule', data: {preload: true}},
  {
    path: 'offlineEasyModusGame',
    loadChildren: './pages/offline/offline-easy-modus-game/offline-easy-modus-game.module#OfflineEasyModusGamePageModule',
    data: {preload: true}
  },
  {
    path: 'offlineTrainingsGame',
    loadChildren: './pages/offline/offline-trainings-game/offline-trainings-game.module#OfflineTrainingsGamePageModule',
    data: {preload: true}
  },
  {path: 'oneVsOne', loadChildren: './pages/online/onevsone/onevsone.module#OnevsonePageModule', data: {preload: true}},
  {
    path: 'oneVsOneChoice',
    loadChildren: './pages/online/onevsone-choice/onevsone-choice.module#OnevsoneChoicePageModule',
    data: {preload: true}
  },
  {path: 'oneVsOneGame', loadChildren: './pages/online/onevsone-game/onevsone-game.module#OnevsoneGamePageModule', data: {preload: true}},
  {path: 'statsOffline', loadChildren: './pages/offline/stats-offline/stats-offline.module#StatsOfflinePageModule', data: {preload: true}},
  {path: 'game-decision', loadChildren: './pages/offline/game-decision/game-decision.module#GameDecisionPageModule', data: {preload: true}},
  {path: 'online-list', loadChildren: './pages/online/online-list/online-list.module#OnlineListPageModule', data: {preload: true}},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
