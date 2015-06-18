var TableComponent = React.createClass({

    getInitialState: function () {
        return {
            data: [],
            sortDir: {}
        };
    },

    componentDidMount: function () {
        $.getJSON(this.props.src, {
            format: "json"
        }).done(function (data) {

            if (this.isMounted()) {
                this.setState({
                    data: data
                });
            }
        }.bind(this));
    },

    getColumnNames: function () {
        if (this.isMounted()) {
            var firstEl = this.state.data[0];
            return Object.keys(firstEl);
        }
    },

    sortByColumn: function (array, column, sortDir) {
        return array.sort(function (a, b) {
            var x = a[column];
            var y = b[column];
            if (sortDir === 'asc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            } else {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
        });
    },

    sort: function (column) {
        var sortDir = this.state.sortDir;
        var data = this.state.data;
        var sortedData = this.sortByColumn(data, column, sortDir[column]);
        this.setState({data: sortedData});
        sortDir[column] = (sortDir[column] === 'asc' ? 'dsc' : 'asc');
        this.setState({sortDir: sortDir});
        this.props.caption += ' Sorted By ' + ' ' + column + ' ' + sortDir;
    },

    render: function () {
        var columns = this.getColumnNames();
        var data = this.state.data;

        if (this.isMounted()) {
            return (
                <table>
                    <TableCaption caption={this.props.caption} onSort={this.sort} />
                    <thead>
                        <TableHeader onSort={this.sort} columns={columns} />
                    </thead>
                    <TableBody data={data} columns={columns} />
                </table>
            )
        } else {
            return (
                <table></table>
            )
        }
    }
});


var TableHeader = React.createClass({
    sort: function (column) {
        return function (event) {

            var code = event.charCode || event.keyCode,
                type = event.type;

            if (type === 'keydown') {
                var ENTER = 13,
                    SPACE = 32;

                if ((code !== ENTER) && (code !== SPACE)) {
                    event.stopPropagation();
                }
                else if (code === SPACE) {
                    event.preventDefault();
                }
            }

            var sortDir = this.props.sortDir;
            console.log(sortDir);
            console.log(column);
            this.props.onSort(column, sortDir);
        }.bind(this);
    },

    render: function () {
        var columns = this.props.columns;
        var cell = function () {
            return columns.map(function (c, i) {
                return <th scope="col" tabIndex="0" role="columnheader" onKeyDown={this.sort(c)}  onClick={this.sort(c)} key={c}>{c}</th>;
            }, this);
        }.bind(this);


        return (
            <tr key="headerRow">{ cell(this.props.item) }</tr>
        )
    }
});

var TableCaption = React.createClass({

    render: function () {

        return (
            <caption role="status" aria-live="assertive" aria-relevant="all" aria-atomic="true">{this.props.caption}</caption>
        )
    }
});


var TableBody = React.createClass({
    render: function () {
        var columns = this.props.columns;
        var data = this.props.data;

        return (
            <tbody>
        {data.map(function (item, idx) {
            return <TableRow key={idx} data={item} columns={columns}/>;
        })}
            </tbody>
        )
    }
});


var TableRow = React.createClass({
    render: function () {
        var columns = this.props.columns;
        var data = this.props.data;
        var td = function (item) {

            return columns.map(function (c, i) {



                return <td key={i}>{item[c]}</td>;
            }, this);
        }.bind(this);

        return (
            <tr key={data}>{ td(data) }</tr>
        )
    }
});


React.render(
    <TableComponent caption="Foo" src="./data/data.json" />, document.getElementById('table')
)
