import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { VocubalarService } from '../../services/vocubalar';
import { Chart } from "chart.js";
import { Router } from '@angular/router';

@Component({
  selector: 'stats-offline',
  templateUrl: './stats-offline.html',
  styleUrls: ['./stats-offline.scss'],
})
export class StatsOfflinePage implements OnInit {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  private barChart: Chart;
  data;


  constructor(private vocService: VocubalarService, private router: Router) { }

  ngOnInit() {
    this.data = {
      datasets: [{
          data: [(this.vocService.getMaxCounter() - this.vocService.getCorrectCounter()), this.vocService.getCorrectCounter()],
          backgroundColor: [
                      "rgba(204,0,0, 1)",
                      "rgba(0,204,51,1)",
                    ],
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Falsch',
          'Richtig',
      ]
  };
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'pie',
      data: this.data,
    });
  }

  openOffline() {
    this.router.navigateByUrl('offline');
  }

}
